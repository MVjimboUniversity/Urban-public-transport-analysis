import React, { useState, useEffect } from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
// import LocationGetter from "./LocationGetter"
import { useMapEvents } from "react-leaflet";
import { Polygon } from "react-leaflet";
import { cityService } from "../../../services/city.service";

function CityMap({cityname}) {
    const [positions, setPositions] = useState([]);

    function LocationGetter() {
      const map = useMapEvents({
          click(e) {
              setPositions([...positions, e.latlng]);
              console.log(positions);
          }
      });
      return null;
    }

    function clear() {
      setPositions([]);
    }

    const [cityData, setCityData] = useState({});

    useEffect(() => {
          const fetchData = async () => {
              const data = await cityService.getCity();
              // filtering cities
              
              setCityData(data);
          }
          fetchData()
      }, [])
    console.log('cityData = ', cityData);
    return (
      <div className={styles.MapContainer}>
        <MapContainer className={styles.Map} center={[0, 0]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[0, 0]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <LocationGetter></LocationGetter>
          <Polygon positions={positions}></Polygon>
        </MapContainer>
        <button className={styles.btn} onClick={clear}>Очистить форму</button>
      </div>     
)}

export default CityMap