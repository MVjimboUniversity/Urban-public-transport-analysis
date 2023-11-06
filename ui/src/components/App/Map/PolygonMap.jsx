import React from "react";
import { MapContainer, TileLayer } from 'react-leaflet'
import { Polygon } from "react-leaflet";
import styles from '../Map/Map.module.css'


function PolygonMap({pos}) {
    const blackOptions = { color: 'black' }
    const Center = [(pos[0][0][0] + pos[0][1][0]) / 2, (pos[0][0][1] + pos[0][1][1]) / 2]
    return (
        <MapContainer className={styles.MapContainer} center={Center} zoom={13} scrollWheelZoom={true}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polygon positions={pos[0]} pathOptions={blackOptions}/>
        </MapContainer>
    )
}


export default PolygonMap