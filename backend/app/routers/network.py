import json
from typing import Annotated
# import osmnx as ox
import pandas as pd
from fastapi import APIRouter, Query, Body, Depends
from shapely import Polygon
from pydantic import BaseModel

import app.public_transport_osmnx.osmnx as ox
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


class ReturnGraph(BaseModel):
    center: list
    nodes: list
    edges: list

class ReturnGraphByName(ReturnGraph):
    boundaries: list


@router.get("/name", response_model=ReturnGraphByName)
async def network_by_name(
    city: Annotated[str, Query(description="Название города.")],
    connected: Annotated[bool, Query(description="Нужно ли соединять остановки разных типов транспорта в радиусе 200 метров.")],
    filters: FilterParams
):
    """
    Возвращает сеть трамвайных путей по названию.
    """
    geocode_gdf = ox.geocode_to_gdf(city)
    boundaries = geocode_gdf["geometry"]
    G, routes, stops, paths_routes = ox.graph_from_place(city, simplify=True, retain_all=True, network_types=filters, connected=connected)
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


@router.get("/bbox", response_model=ReturnGraph)
async def network_by_bbox(
    north: Annotated[float, Query(description="Северная широта ограничительной рамки.")],
    south: Annotated[float, Query(description="Южная широта ограничительной рамки.")],
    east: Annotated[float, Query(description="Восточная долгота ограничивающей рамки.")],
    west: Annotated[float, Query(description="Западная долгота ограничивающей рамки.")],
    connected: Annotated[bool, Query(description="Нужно ли соединять остановки разных типов транспорта в радиусе 200 метров.")],
    filters: FilterParams
):
    """
    Возвращает сеть трамвайных путей по ограниченой рамке.
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


@router.post("/polygon", response_model=ReturnGraph)
async def network_by_polygon(
    polygon: Annotated[list[tuple[float, float]], Body(description="Последовательность координат, задающая полигон.")],
    connected: Annotated[bool, Query(description="Нужно ли соединять остановки разных типов транспорта в радиусе 200 метров.")],
    filters: FilterParams
):
    """
    Возвращает сеть трамвайных путей по полигону.
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


class ReturnCheck(BaseModel):
    is_graph_exist: bool


@router.get("/db/check", response_model=ReturnCheck)
async def is_graph_exist():
    """
    Проверяет существует ли граф в базе данных.
    """
    return {"is_graph_exist": bool(check_graph(driver))}


@router.post("/db", response_model=ReturnGraph)
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