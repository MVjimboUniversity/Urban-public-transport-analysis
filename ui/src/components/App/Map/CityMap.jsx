import React from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";


function CityMap({pos}) {
    return (
    <MapContainer className={styles.MapContainer} center={[pos[0], pos[1]]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[pos[0], pos[1]]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
)}

export default CityMap