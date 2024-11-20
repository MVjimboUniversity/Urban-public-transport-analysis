import json
from typing import Annotated
import osmnx as ox
import pandas as pd
from fastapi import APIRouter, Query, Body, Depends
from shapely import Polygon
import networkx as nx

#import app.public_transport_osmnx.osmnx as ox
from app.database import driver, create_graph, get_graph, check_graph, remove_graph

router = APIRouter(
    prefix="/network",
    tags=["Network"],
)

async def filter_parameters(bus: bool = False, tram: bool = False, trolleybus: bool = False, subway: bool = False):
    result = []

    if bus:
        result.append("bus")

    if tram:
        result.append("tram")

    if trolleybus:
        result.append("trolleybus")
    
    if subway:
        result.append("subway")

    return result

FilterParams = Annotated[dict, Depends(filter_parameters)]


@router.get("/name")
async def network_by_name(
    city: Annotated[str, Query(description="Название города.")],
    connected: Annotated[bool, Query(description="Нужно ли соединять остановки разных типов транспорта в радиусе 200 метров.")],
    filters: FilterParams
):
    """
    Возвращает сеть общественного транспорта по названию.
    """
    
    geocode_gdf = ox.geocode_to_gdf(city)
    boundaries = geocode_gdf["geometry"]
    pd.set_option('display.max_columns', None)
    city_polygon = ox.geocoder.geocode_to_gdf(city).geometry.iloc[0]
    if city_polygon.geom_type == "MultiPolygon":
        coords = []
        for polygon in city_polygon.geoms:
            coords.extend([f"{lat} {lon}" for lon, lat in polygon.exterior.coords])
        coords = " ".join(coords)
        # coords = " ".join(f"{lat} {lon}" for lon, lat in list(city_polygon.geoms)[0].exterior.coords)
    elif city_polygon.type == "Polygon":
        coords = " ".join(f"{lat} {lon}" for lon, lat in city_polygon.exterior.coords)
    else:
        raise "ERROR POLYGON"

    nodes_overpass_query = f"""
        [out:json];
        (
          node["public_transport"="stop_position"](poly:"{coords}");
        );
        out body;
        >;
        out skel qt;
    """
    nodes_response = ox._overpass._overpass_request(data={"data": nodes_overpass_query})
    nodes_df = pd.DataFrame.from_dict(nodes_response['elements'])

    nodes_list = []
    for row in nodes_response['elements']:
        tmp_dict = row['tags']
        tmp_dict['osmid']=row['id']
        tmp_dict['x'] = row['lat']
        tmp_dict['y'] = row['lon']
        nodes_list.append(tmp_dict)
    nodes_df = pd.DataFrame.from_dict(nodes_list)
    G = nx.MultiDiGraph()       #создаем пустой граф
    if "crs" not in G.graph:
        G.graph["crs"] = "EPSG:4326"    #задаем параметр для работы с координатами

    for idx, row in nodes_df.iterrows():
        if row['bus'] != 'yes': continue
        G.add_node(row['osmid'], **row.to_dict())
    overpass_query = f"""
    [out:json];
    relation["route"="bus"](poly:"{coords}")->.routes;
    (
      .routes;
    );
    out body;
    >;
    out skel qt;
    """
    routes = ox._overpass._overpass_request(data={"data": overpass_query})
    relations = pd.DataFrame(columns=['relation_id', 'relation_members', 'relation_ways'])

    for element in routes["elements"]:
        if element['type'] == 'relation':
            node_list = []
            way_list = []
        
            for member in element['members']:
                if (member['type'] == 'node'): node_list.append(member['ref'])
                elif (member['type'] == 'way'): way_list.append(member['ref'])
                
            relations.loc[len(relations)] = [element['id'], node_list, way_list]
    graph_nodes = G.nodes


    for idx, members in relations.iterrows():

        members = members['relation_members']
    
        l = -1
        for i in range(len(members)):
            if members[i] in graph_nodes:
                l = i
                break
        if l == -1: 
            continue

        r = l + 1
        while r < len(members):
            if members[r] in graph_nodes:
                G.add_edge(members[l], members[r])
                l = r
            r += 1
    
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    df_center = geocode_gdf[["lat", "lon"]]
    create_graph(driver, df_center, gdf_nodes, gdf_relationships)
    data = {
        "center": [ geocode_gdf.loc[0, "lon"], geocode_gdf.loc[0, "lat"]],
        "boundaries": json.loads(boundaries.to_json()),
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)


@router.get("/bbox")
async def network_by_bbox(
    north: Annotated[float, Query(description="Северная широта ограничительной рамки.")],
    south: Annotated[float, Query(description="Южная широта ограничительной рамки.")],
    east: Annotated[float, Query(description="Восточная долгота ограничивающей рамки.")],
    west: Annotated[float, Query(description="Западная долгота ограничивающей рамки.")],
    connected: Annotated[bool, Query(description="Нужно ли соединять остановки разных типов транспорта в радиусе 200 метров.")],
    filters: FilterParams
):
    """
   Возвращает сеть общественного транспорта по ограниченой рамке.
    """
    G, routes, stops, paths_routes = ox.graph_from_bbox(north, south, east, west, simplify=True, retain_all=True, network_types=filters, connected=connected)
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    df_center = pd.DataFrame(data = {"lon": (east + west) / 2, "lat": (north + south) / 2}, index=[0, ])
    create_graph(driver, df_center, gdf_nodes, gdf_relationships)
    data = {
        "center": [(east + west) / 2, (north + south) / 2],
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)


@router.post("/polygon")
async def network_by_polygon(
    polygon: Annotated[list[tuple[float, float]], Body(description="Последовательность координат, задающая полигон.")],
    connected: Annotated[bool, Query(description="Нужно ли соединять остановки разных типов транспорта в радиусе 200 метров.")],
    filters: FilterParams
):
    """
   Возвращает сеть общественного транспорта по полигону.
    """
    polygon = Polygon(polygon)
    G, routes, stops, paths_routes = ox.graph_from_polygon(polygon, simplify=True, retain_all=True, network_types=filters, connected=connected)
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    center = list(polygon.centroid.coords[0])
    df_center = pd.DataFrame(data = {"lon": center[0], "lat": center[1]}, index=[0, ])
    create_graph(driver, df_center, gdf_nodes, gdf_relationships)
    data = {
        "center": [df_center.loc[0, "lon"], df_center.loc[0, "lat"]],
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)


@router.get("/db/check")
async def is_graph_exist():
    """
    Проверяет существует ли граф в базе данных.
    """
    return {"is_graph_exist": bool(check_graph(driver))}


@router.post("/db")
async def read_graph(
    polygon: Annotated[list[tuple[float, float]], Body(description="Последовательность координат, задающая полигон.")] = None
):
    """
    Возвращает граф из базы данных.
    """
    df_center, gdf_nodes, gdf_relationships = get_graph(driver, polygon)
    data = {
        "center": [ df_center.loc[0, "lon"], df_center.loc[0, "lat"]],
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)


@router.get("/db/delete")
async def delete_graph():
    """
    Удаляет граф из базы данных.
    """
    remove_graph(driver)