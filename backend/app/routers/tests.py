import json
from typing import Annotated
import osmnx as ox
from fastapi import APIRouter, Query, Body
from shapely import Polygon

import app.public_transport_osmnx.osmnx as ptox


# Тестовое API для отладки работы фронта и бэка вместе. Впоследствии API будет отключено.

router = APIRouter(
    prefix="/tests",
    tags=["tests"],
)

@router.get("/TramNetwork/name")
async def tram_network_by_name(city: Annotated[str, Query(description="Название города.")]):
    """
    Возвращает сеть трамвайных путей по названию.
    """
    geocode_gdf = ox.geocode_to_gdf(city)
    boundaries = geocode_gdf["geometry"]
    G, routes, stops, paths_routes = ptox.graph_from_place(city, simplify=True, retain_all=True, network_type="tram")
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    data = {
        "center": [geocode_gdf.loc[0, "lon"], geocode_gdf.loc[0, "lat"]],
        "boundaries": json.loads(boundaries.to_json()),
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)

@router.get("/TramNetwork/bbox")
async def tram_network_by_bbox(
    north: Annotated[float, Query(description="Северная широта ограничительной рамки.")],
    south: Annotated[float, Query(description="Южная широта ограничительной рамки.")],
    east: Annotated[float, Query(description="Восточная долгота ограничивающей рамки.")],
    west: Annotated[float, Query(description="Западная долгота ограничивающей рамки.")]
):
    """
    Возвращает сеть трамвайных путей по ограниченой рамке.
    """
    G = ox.graph_from_bbox(north, south, east, west, custom_filter='["railway"~"tram"]')
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    data = {
        "center": [(north + south) / 2, (east + west) / 2],
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)

@router.post("/TramNetwork/polygon")
async def tram_network_by_polygon(
    polygon: Annotated[list[tuple[float, float]], Body(description="Последовательность координат, задающая полигон.")],
):
    """
    Возвращает сеть трамвайных путей по полигону.
    """
    polygon = Polygon(polygon)
    G = ox.graph_from_polygon(polygon, custom_filter='["railway"~"tram"]')
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    data = {
        "center": list(polygon.centroid.coords),
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)