import React, { useState, useEffect, useMemo } from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer, Polygon, useMapEvents, Circle, Polyline } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
import { Rectangle } from "react-leaflet";
import { cityService } from "../../../services/city.service";
import HashLoader from "react-spinners/HashLoader"


function RectangleMap({pos}) {
    const [loaded, setLoaded] = useState(false);

    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);
    //const [center, setCenter] = useState([]);

    // map settings
    const blackOptions = { color: 'black' };
    const redOptions = { color: 'red' };
    const limeOptions = { color: 'lime' };

    const rectangle = [
        [parseFloat(pos[0]), parseFloat(pos[2])],
        [parseFloat(pos[1]), parseFloat(pos[3])]
    ];

    // getting data from api
    
    let bbox = useMemo(() => [], []);
    bbox = {
        north: rectangle[0][0],
        south: rectangle[1][0],
        east: rectangle[0][1],
        west: rectangle[1][1],
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await cityService.getBbox(bbox);
            //setCenter([data.center[1], data.center[0]]);
            setEdges(data.edges.features.map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setNodes(data.nodes.features.map(item => [item.properties.y, item.properties.x, item.id]));
            setLoaded(true);
        }
        fetchData();
    }, [bbox]);

    const Center = [(rectangle[0][0] + rectangle[1][0]) / 2 , (rectangle[0][1] + rectangle[1][1]) / 2];


    // press on map
    const [positions, setPositions] = useState([]);
    function LocationGetter() {
        useMapEvents({
              click(e) {
                  setPositions([...positions, e.latlng]);
              }
        });
        return null;
    }

    function clear() {
        setPositions([]);
    }
    if (!loaded) {
        return (
            <div className={styles.MapContainer}>
                <HashLoader color={'#352F44'} size={100} className={styles.loader}></HashLoader>
            </div>
        )
    }
    return (
        <div className={styles.MapContainer}>
            <MapContainer className={styles.Map} center={Center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={Center}>
                    <Popup>Центр города</Popup>
                </Marker>
                <Rectangle bounds={rectangle} pathOptions={blackOptions}/>
                <Polygon pathOptions={redOptions} positions={positions}></Polygon>
                {
                    nodes.map((el) => (
                        <Circle key={el[2]} center={[el[0], el[1]]}></Circle>                        
                    ))
                }
                <Polyline positions={edges} pathOptions={limeOptions}></Polyline>
                <LocationGetter/>
            </MapContainer>
            <button className={styles.btn} onClick={clear}>Очистить карту</button>
        </div>
      )
}   


export default RectangleMap