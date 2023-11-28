import json
from typing import Annotated
# import osmnx as ox
import pandas as pd
from fastapi import APIRouter, Query, Body
from shapely import Polygon

import app.public_transport_osmnx.osmnx as ox
from app.database import driver, create_graph, get_graph, check_graph

router = APIRouter(
    prefix="/network",
    tags=["Network"],
)

@router.get("/name")
async def network_by_name(city: Annotated[str, Query(description="Название города.")]):
    """
    Возвращает сеть трамвайных путей по названию.
    """
    geocode_gdf = ox.geocode_to_gdf(city)
    boundaries = geocode_gdf["geometry"]
    G, routes, stops, paths_routes = ox.graph_from_place(city, simplify=True, retain_all=True, network_type="tram")
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
    west: Annotated[float, Query(description="Западная долгота ограничивающей рамки.")]
):
    """
    Возвращает сеть трамвайных путей по ограниченой рамке.
    """
    G, routes, stops, paths_routes = ox.graph_from_bbox(north, south, east, west, simplify=True, retain_all=True, network_type="tram")
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    df_center = pd.DataFrame(data = {"lon": (north + south) / 2, "lat": (east + west) / 2})
    create_graph(driver, df_center, gdf_nodes, gdf_relationships)
    data = {
        "center": [(north + south) / 2, (east + west) / 2],
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)

@router.post("/polygon")
async def network_by_polygon(
    polygon: Annotated[list[tuple[float, float]], Body(description="Последовательность координат, задающая полигон.")],
):
    """
    Возвращает сеть трамвайных путей по полигону.
    """
    polygon = Polygon(polygon)
    G, routes, stops, paths_routes = ox.graph_from_polygon(polygon, simplify=True, retain_all=True, network_type="tram")
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    center = list(polygon.centroid.coords)
    df_center = pd.DataFrame(data = {"lon": center[0], "lat": center[1]})
    create_graph(driver, df_center, gdf_nodes, gdf_relationships)
    data = {
        "center": list(polygon.centroid.coords),
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

@router.get("/db")
async def read_graph():
    """
    Возвращает граф из базы данных.
    """
    df_center, gdf_nodes, gdf_relationships = get_graph(driver)
    data = {
        "center": [ df_center.loc[0, "lon"], df_center.loc[0, "lat"]],
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)