import React from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
import { Rectangle } from "react-leaflet";


function RectangleMap({pos}) {
    const blackOptions = { color: 'black' }
    const rectangle = [
        [parseFloat(pos[0]), parseFloat(pos[2])],
        [parseFloat(pos[1]), parseFloat(pos[3])]
    ];
    const Center = [(rectangle[0][0] + rectangle[1][0]) / 2 , (rectangle[0][1] + rectangle[1][1]) / 2];
    return (<div>
        <MapContainer className={styles.MapContainer} center={Center} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={Center}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Rectangle bounds={rectangle} pathOptions={blackOptions}/>
        </MapContainer>
        </div>
      )
}   


export default RectangleMap