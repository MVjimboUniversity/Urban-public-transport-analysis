import os
import neo4j

# NEO4J_URI = "neo4j://neo4j:7687"
# NEO4J_USER = "neo4j"
# NEO4J_PASSWORD = "123456789"

NEO4J_URI = os.environ["NEO4J_URI"]
NEO4J_USER = os.environ["NEO4J_USER"]
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]

driver = neo4j.GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))