import geopandas as gpd

# First, define Cypher queries to create constraints and indexes
constraint_query = "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Intersection) REQUIRE i.osmid IS UNIQUE"
rel_index_query = "CREATE INDEX IF NOT EXISTS FOR ()-[r:ROAD_SEGMENT]-() ON r.osmids"
address_constraint_query = "CREATE CONSTRAINT IF NOT EXISTS FOR (a:Address) REQUIRE a.id IS UNIQUE"
point_index_query = "CREATE POINT INDEX IF NOT EXISTS FOR (i:Intersection) ON i.location"

# Cypher query to import our road network nodes GeoDataFrame
node_query = '''
    UNWIND $rows AS row
    WITH row WHERE row.osmid IS NOT NULL
    MERGE (s:Stop {osmid: row.osmid})
        SET s.location = 
         point({latitude: row.y, longitude: row.x }),
            s.name = row.name,
            s.highway = row.highway,
            s.public_transport = row.public_transport,
            s.routes = row.routes,
            s.tram = row.tram,
            s.bus = row.bus,
            s.geometry_wkt = row.geometry_wkt,
            s.street_count = toInteger(row.street_count)
    RETURN COUNT(*) as total
    '''

# Cypher query to import our road network relationships GeoDataFrame
rels_query = '''
    UNWIND $rows AS path
    MATCH (u:Stop {osmid: path.u})
    MATCH (v:Stop {osmid: path.v})
    MERGE (u)-[r:ROUTE_SEGMENT {osmid: path.osmid}]->(v)
        SET r.name = path.name,
            r.highway = path.highway,
            r.railway = path.railway,
            r.oneway = path.oneway,
            r.lanes = path.lanes,
            r.max_speed = path.maxspeed,
            r.geometry_wkt = path.geometry_wkt,
            r.length = toFloat(path.length)
    RETURN COUNT(*) AS total
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

def create_graph(driver, gdf_nodes, gdf_relationships):
    # Changing GeoDataFrame to insert data
    gdf_nodes.reset_index(inplace=True)
    gdf_relationships.reset_index(inplace=True)
    gdf_nodes["geometry_wkt"] = gdf_nodes["geometry"].apply(lambda x: x.wkt)
    gdf_relationships["geometry_wkt"] = gdf_relationships["geometry"].apply(lambda x: x.wkt)

    # Run our constraints queries and nodes GeoDataFrame import
    with driver.session() as session:
        session.execute_write(create_constraints)
        session.execute_write(insert_data, node_query, gdf_nodes.drop(columns=["geometry"]))

    # Run our relationships GeoDataFrame import
    with driver.session() as session:
        session.execute_write(insert_data, rels_query, gdf_relationships.drop(columns=["geometry"]))

node_get_query = '''
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
s.geometry_wkt AS geometry_wkt
'''

rels_get_query = '''
MATCH (u:Stop)-[r:ROUTE_SEGMENT]->(v:Stop) 
RETURN
u.osmid AS u, 
v.osmid AS v, 
r.osmid AS osmid, 
r.name AS name, 
r.highway AS higway, 
r.lanes AS lanes, 
r.maxspeed AS maxspeed, 
r.railway AS railway, 
r.oneway AS oneway, 
r.reversed AS reversed, 
r.length AS length, 
r.geometry_wkt AS geometry_wkt
'''

def get_data(tx, query):
    results = tx.run(query)
    df = results.to_df()
    df['geometry'] = gpd.GeoSeries.from_wkt(df['geometry_wkt'])
    gdf = gpd.GeoDataFrame(df, geometry='geometry')
    gdf = gdf.drop(columns=["geometry_wkt"])
    return gdf

def get_graph(driver):
    gdf_nodes = None
    gdf_relationships = None

    with driver.session() as session:
        gdf_nodes = session.execute_read(get_data, node_get_query)

    with driver.session() as session:
        gdf_relationships = session.execute_read(get_data, rels_get_query)
    
    return gdf_nodes, gdf_relationships

COUNT_QUERY = """
MATCH (n) RETURN COUNT(n) AS node_count
"""

def is_exist(tx):
    results = tx.run(COUNT_QUERY)
    df = results.to_df()
    return df.loc[0, "node_count"] != 0

def check_graph(driver):
    df = False

    with driver.session() as session:
        df = session.execute_read(is_exist)
    
    return df