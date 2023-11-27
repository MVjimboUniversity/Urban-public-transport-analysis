import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents, Polyline, Circle, Marker, Popup } from 'react-leaflet'
import styles from '../Map/Map.module.css'
import { cityService } from "../../../services/city.service";
import HashLoader from "react-spinners/HashLoader"



function PolygonMap({pos, transport}) {
    const [loaded, setLoaded] = useState(false);

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [center, setCenter] = useState([]);

    // map settings
    const blackOptions = { color: 'black' };
    const redOptions = { color: 'red' };
    const limeOptions = { color: 'lime' };

    // getting data from api
    
    pos = pos[0];
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await cityService.getPolygon(JSON.stringify(pos));
            console.log(data);
            setEdges(data.edges.features.map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setNodes(data.nodes.features.map(item => [item.properties.y, item.properties.x, item.id]));
            setCenter([data.center[0][1], data.center[0][0]]);
            setLoaded(true);
        };
        fetchData();
    }, [pos]);


    

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
    const leafletpos = pos.map((el) => [el[1], el[0]]);
    return (
        <div className={styles.MapContainer}>
            <MapContainer className={styles.Map} center={center} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                    Центр города.
                    </Popup>
                 </Marker>
                <Polygon positions={leafletpos} pathOptions={blackOptions}/>
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


export default PolygonMap