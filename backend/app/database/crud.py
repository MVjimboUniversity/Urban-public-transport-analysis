import pandas as pd
import geopandas as gpd
from shapely import Polygon


# First, define Cypher queries to create constraints and indexes
constraint_query = "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Intersection) REQUIRE i.osmid IS UNIQUE"
rel_index_query = "CREATE INDEX IF NOT EXISTS FOR ()-[r:ROAD_SEGMENT]-() ON r.osmids"
address_constraint_query = "CREATE CONSTRAINT IF NOT EXISTS FOR (a:Address) REQUIRE a.id IS UNIQUE"
point_index_query = "CREATE POINT INDEX IF NOT EXISTS FOR (i:Intersection) ON i.location"


# Cypher query to import our road network nodes GeoDataFrame
NODE_INSERT_QUERY = '''
    UNWIND $rows AS row
    WITH row WHERE row.osmid IS NOT NULL
    MERGE (s:Stop {osmid: row.osmid})
        SET s.location = point({latitude: row.x, longitude: row.y }),
            s.name = row.name,
            s.stops_osmid = row.stops_osmid,
            s.transport = row.transport,
            s.center_count = toFloat(row.center_count),
            s.closeness_centrality = toFloat(row.closeness_centrality),
            s.betweenness_centrality = toFloat(row.betweenness_centrality),
            s.pagerank = toFloat(row.pagerank)
    RETURN COUNT(*) as total
    '''

# Cypher query to import our road network relationships GeoDataFrame

# RELS_INSERT_QUERY = '''
#     UNWIND $rows AS path
#     MATCH (u:Stop {osmid: path.u})
#     MATCH (v:Stop {osmid: path.v})
#     MERGE (u)-[r:ROUTE_SEGMENT {osmid: path.osmid}]->(v)
#         SET r.name = path.name,
#             r.highway = path.highway,
#             r.railway = path.railway,
#             r.oneway = path.oneway,
#             r.lanes = path.lanes,
#             r.max_speed = path.maxspeed,
#             r.geometry_wkt = path.geometry_wkt,
#             r.length = toFloat(path.length)
#     RETURN COUNT(*) AS total
#     '''
RELS_INSERT_QUERY = '''
    UNWIND $rows AS path
    MATCH (u:Stop {osmid: path.u})
    MATCH (v:Stop {osmid: path.v})
    MERGE (u)-[r:ROUTE_SEGMENT]->(v)
        SET r.geometry_wkt = path.geometry_wkt

    RETURN COUNT(*) AS total
    '''


COUNT_QUERY = '''
    MATCH (s: Stop) RETURN COUNT(s) AS node_count
    '''


CENTER_INSERT_QUERY = '''
    UNWIND $rows AS row
    MERGE (c:Center {location: point({latitude: row.lat, longitude: row.lon })})
    RETURN COUNT(*) AS total
    '''


CENTER_GET_QUERY = '''
    MATCH (c:Center)
    RETURN
    c.location.latitude AS lat,
    c.location.longitude AS lon
    '''

def create_constraints(tx):
    result = tx.run(constraint_query)
    result = tx.run(rel_index_query)
    result = tx.run(address_constraint_query)
    result = tx.run(point_index_query)

# Function to batch our GeoDataFrames
def insert_data(tx, query, rows, batch_size=10000):
    total = 0
    batch = 0
    
    while batch * batch_size < len(rows):
        results = tx.run(query, parameters = {'rows': rows[batch*batch_size:(batch+1)*batch_size].to_dict('records')}).data()
        print(results)
        total += results[0]['total']
        batch += 1


def create_graph(driver, df_center, gdf_nodes, gdf_relationships):
    # Changing GeoDataFrame to insert data
    gdf_nodes.reset_index(inplace=True)
    gdf_relationships.reset_index(inplace=True)
    gdf_nodes["geometry_wkt"] = gdf_nodes["geometry"].apply(lambda x: x.wkt)
    gdf_relationships["geometry_wkt"] = gdf_relationships["geometry"].apply(lambda x: x.wkt)

    # Run our constraints queries and nodes GeoDataFrame import
    with driver.session() as session:
        session.execute_write(create_constraints)
        session.execute_write(insert_data, NODE_INSERT_QUERY, gdf_nodes.drop(columns=["geometry"]))
        session.execute_write(insert_data, CENTER_INSERT_QUERY, df_center)

    # Run our relationships GeoDataFrame import
    with driver.session() as session:
        session.execute_write(insert_data, RELS_INSERT_QUERY, gdf_relationships.drop(columns=["geometry"]))


NODE_GET_QUERY = '''
    MATCH (s:Stop) 
    RETURN 
    s.osmid AS osmid, 
    s.location.longitude AS x, 
    s.location.latitude AS y, 
    s.name AS name, 
    s.public_transport AS public_transport, 
    s.tram AS tram, 
    s.bus AS bus, 
    s.routes AS routes, 
    s.street_count AS street_count, 
    s.geometry_wkt AS geometry_wkt,
    s.center_count AS center_count
    '''


RELS_GET_QUERY = '''
    MATCH (u:Stop)-[r:ROUTE_SEGMENT]->(v:Stop) 
    RETURN
    u.osmid AS u, 
    v.osmid AS v, 
    r.osmid AS osmid, 
    r.name AS name, 
    r.highway AS highway, 
    r.lanes AS lanes, 
    r.maxspeed AS maxspeed, 
    r.railway AS railway, 
    r.oneway AS oneway, 
    r.reversed AS reversed, 
    r.length AS length, 
    r.geometry_wkt AS geometry_wkt
    '''


bbox_query = lambda node_name: 'point.withinBBox(' + node_name + '.location, point({longitude: $minx, latitude: $miny }), point({longitude: $maxx, latitude: $maxy}))'


node_get_bbox_query = lambda bbox_query: f'''
    MATCH (s:Stop)
    WHERE {bbox_query('s')}
    RETURN 
    s.osmid AS osmid, 
    s.location.longitude AS x, 
    s.location.latitude AS y, 
    s.name AS name, 
    s.public_transport AS public_transport, 
    s.tram AS tram, 
    s.bus AS bus, 
    s.routes AS routes, 
    s.street_count AS street_count, 
    s.geometry_wkt AS geometry_wkt,
    s.center_count AS center_count
    '''


rels_get_bbox_query = lambda bbox_query: f'''
    MATCH (u:Stop)-[r:ROUTE_SEGMENT]->(v:Stop)
    WHERE {bbox_query('u')}
    AND {bbox_query('v')}
    RETURN
    u.osmid AS u, 
    v.osmid AS v, 
    r.osmid AS osmid, 
    r.name AS name, 
    r.highway AS highway, 
    r.lanes AS lanes, 
    r.maxspeed AS maxspeed, 
    r.railway AS railway, 
    r.oneway AS oneway, 
    r.reversed AS reversed, 
    r.length AS length, 
    r.geometry_wkt AS geometry_wkt
    '''


# def get_geo_df(tx, query):
#     results = tx.run(query)
#     df = results.to_df()
#     df['geometry'] = gpd.GeoSeries.from_wkt(df['geometry_wkt'])
#     gdf = gpd.GeoDataFrame(df, geometry='geometry')
#     gdf = gdf.drop(columns=["geometry_wkt"])
#     return gdf


def get_df(tx, query):
    results = tx.run(query)
    df = results.to_df()
    return df


def get_geo_df(tx, query, bounds=None):
    if bounds is None:
        results = tx.run(query)
    else:
        minx, miny, maxx, maxy = bounds
        results = tx.run(query, parameters={"minx": minx, "miny": miny, "maxx": maxx, "maxy": maxy})
    df = results.to_df()
    df['geometry'] = gpd.GeoSeries.from_wkt(df['geometry_wkt'])
    gdf = gpd.GeoDataFrame(df, geometry='geometry')
    gdf = gdf.drop(columns=["geometry_wkt"])
    return gdf


def get_graph(driver, polygon):
    gdf_nodes = None
    gdf_relationships = None
    df_center = None

    if polygon:
        custom_polygon = Polygon(polygon)
        custom_bounds = custom_polygon.bounds

        with driver.session() as session:
            node_get_query = node_get_bbox_query(bbox_query)
            gdf_nodes = session.execute_read(get_geo_df, node_get_query, custom_bounds)
            
            gdf_nodes = gdf_nodes[gdf_nodes["geometry"].within(custom_polygon)]

            df_center = session.execute_read(get_df, CENTER_GET_QUERY)
            custom_centroid = custom_polygon.centroid
            df_center = pd.DataFrame(data={"lat": custom_centroid.y, "lon": custom_centroid.x}, index=[0, ])

            rels_get_query = rels_get_bbox_query(bbox_query)
            gdf_relationships = session.execute_read(get_geo_df, rels_get_query, custom_bounds)
            
            gdf_relationships = gdf_relationships[gdf_relationships["geometry"].within(custom_polygon)]
    
    else:
        with driver.session() as session:
            gdf_nodes = session.execute_read(get_geo_df, NODE_GET_QUERY)
            
            df_center = session.execute_read(get_df, CENTER_GET_QUERY)

            gdf_relationships = session.execute_read(get_geo_df, RELS_GET_QUERY)
    
    return df_center, gdf_nodes, gdf_relationships


def is_exist(tx):
    results = tx.run(COUNT_QUERY)
    df = results.to_df()
    return df.loc[0, "node_count"] != 0


def check_graph(driver):
    df = False

    with driver.session() as session:
        df = session.execute_read(is_exist)
    return df


DELETE_QUERY = '''
MATCH (n)
DETACH DELETE n
RETURN count(*);
'''

def remove_graph(driver):
    with driver.session() as session:
        result = session.run(DELETE_QUERY)
        # df = result.to_df()