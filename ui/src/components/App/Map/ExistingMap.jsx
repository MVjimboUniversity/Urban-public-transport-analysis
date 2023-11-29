import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents, Polyline, Circle, Marker, Popup } from 'react-leaflet'
import styles from '../Map/Map.module.css'
import { cityService } from "../../../services/city.service";
import HashLoader from "react-spinners/HashLoader"



function ExistingMap() {
    const [loaded, setLoaded] = useState(false);

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [center, setCenter] = useState([]);

    // map settings
    const redOptions = { color: 'red' };
    const limeOptions = { color: 'lime' };

    // getting data from api
    
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await cityService.getDb();
            setEdges(data.edges.features.map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setNodes(data.nodes.features.map(item => [item.properties.y, item.properties.x, item.id]));
            setCenter([data.center[1], data.center[0]]);
            setLoaded(true);
        };
        fetchData();
    }, []);


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
            <MapContainer className={styles.Map} center={[nodes[0][0],nodes[0][1]]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                    Центр города.
                    </Popup>
                 </Marker>
                <LocationGetter/>
                <Polygon pathOptions={redOptions} positions={positions}></Polygon>
                <Polyline pathOptions={limeOptions} positions={edges}></Polyline>
                {nodes.map((el) => (
                    <Circle center={[el[0], el[1]]} key={el[2]}></Circle>
                ))}
            </MapContainer>
            <button className={styles.btn} onClick={clear}>Очистить карту</button>
        </div>
    )
}


export default ExistingMap