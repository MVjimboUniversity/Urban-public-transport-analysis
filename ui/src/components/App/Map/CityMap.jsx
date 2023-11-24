import React, { useEffect, useState } from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer, Polyline, Circle, Polygon, useMapEvents } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
import { cityService } from "../../../services/city.service";
import HashLoader from "react-spinners/HashLoader";


function CityMap({cityname}) {
    const limeOptions = { color: 'lime' };
    const redOptions = { color: 'red' };

    const [isLoaded, setIsLoaded] = useState(false);
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [center, setCenter] = useState([]);

    // Press on map
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
    
    console.log('usp = ', positions);
    useEffect( () => {
        const fetchData = async () => {
            const data = await cityService.getCity(cityname);
            setCenter([data.center[1], data.center[0]]);
            setEdges(data.edges.features.map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setNodes(data.nodes.features.map(item => [item.properties.y, item.properties.x, item.id]));
            setIsLoaded(true);
        }
        fetchData();
    },  [isLoaded, cityname]);
    if (!isLoaded) {
        return (
            <div className={styles.MapContainer}>
                <HashLoader color={'#352F44'} size={100} className={styles.loader}></HashLoader>   
            </div>
        )
    }
    else return (
        <div className={styles.MapContainer}>
            <MapContainer className={styles.Map} center={center} zoom={13} scrollWheelZoom={false}>
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
                {(nodes.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[0], el[1]]} radius={10}></Circle>
                    )
                ))}
                <Polyline pathOptions={limeOptions} positions={edges}></Polyline>
                <Polygon pathOptions={redOptions} positions={positions}></Polygon>
            </MapContainer>
            <button className={styles.btn} onClick={clear}>Очистить карту</button>
        </div>
  )
}

export default CityMap