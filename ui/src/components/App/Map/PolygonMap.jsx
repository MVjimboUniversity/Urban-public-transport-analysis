import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet'
import styles from '../Map/Map.module.css'


function PolygonMap({pos}) {
    const blackOptions = { color: 'black' };
    const redOptions = {color: 'red'};
    const Center = [(pos[0][0][0] + pos[0][1][0]) / 2, (pos[0][0][1] + pos[0][1][1]) / 2];
    console.log("pos = ", pos);
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
    return (
        <div className={styles.MapContainer}>
            <MapContainer className={styles.Map} center={Center} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polygon positions={pos[0]} pathOptions={blackOptions}/>
                <LocationGetter/>
                <Polygon pathOptions={redOptions} positions={positions}></Polygon>
                <button className={styles.btn} onClick={clear}>Очистить карту</button>
            </MapContainer>
        </div>
    )
}


export default PolygonMap