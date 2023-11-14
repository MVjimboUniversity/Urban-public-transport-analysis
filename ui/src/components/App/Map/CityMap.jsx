import React, { useEffect, useState } from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer, Polyline, Circle } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
import { useLocation } from "react-router";
import { cityService } from "../../../services/city.service";


function CityMap({cityname}) {
    const limeOptions = { color: 'lime' }
    const location = useLocation();
    const dataToApp = location.state;
    console.log(dataToApp);
    const [isLoaded, setIsLoaded] = useState(false);
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [center, setCenter] = useState([]);

    useEffect( () => {
        const fetchData = async () => {
            const data = await cityService.getCity(cityname);
            setCenter([data.center[1], data.center[0]]);
            setEdges(data.edges.features.map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setNodes(data.nodes.features.map(item => [item.properties.y, item.properties.x, item.id]));
            setIsLoaded(true);
        }
        fetchData();
    }, [isLoaded, cityname]);
    console.log(nodes);
    if (!isLoaded) {
      return (
        <div>
          Загрузка
        </div>
      )
    }
    else return (
      <MapContainer className={styles.MapContainer} center={center} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            Центр города.
          </Popup>
        </Marker>
        {(nodes.map((el) =>
          (
              <Circle key={el[2]} center={[el[0], el[1]]} radius={10}></Circle>
          )
        ))}
        <Polyline pathOptions={limeOptions} positions={edges}></Polyline>
      </MapContainer>
  )
}

export default CityMap