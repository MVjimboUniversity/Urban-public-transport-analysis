import json
from typing import Annotated
import osmnx as ox
from fastapi import APIRouter, Query

router = APIRouter(
    prefix="/tests",
    tags=["tests"],
)

@router.get("/TramNetwork")
async def root(city: Annotated[str, Query(description="Название города.")]):
    boundaries = ox.geocode_to_gdf(city)["geometry"]
    G = ox.graph_from_place(city, custom_filter='["railway"~"tram"]')
    gdf_nodes, gdf_relationships = ox.graph_to_gdfs(G)
    data = {
        "boundaries": json.loads(boundaries.to_json()),
        "nodes": json.loads(gdf_nodes.to_json()),
        "edges": json.loads(gdf_relationships.to_json()),
    }
    return json.dumps(data)