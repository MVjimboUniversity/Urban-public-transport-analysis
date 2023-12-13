import React, { useState, useEffect } from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer, Polygon, useMapEvents, Circle, Polyline } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
import { Rectangle } from "react-leaflet";
import { cityService } from "../../../services/city.service";
import HashLoader from "react-spinners/HashLoader"


function RectangleMap({pos, transport}) {

    const tramEdgesOptions = { color: 'red' };
    const tramNodesOptions = { color: 'darkred'};
    const busEdgesOptions = { color: '#398bff' };
    const busNodesOptions = { color: 'darkblue' };
    const blackOptions = {color: 'black'};

    const [loaded, setLoaded] = useState(false);
    const [busEdges, setBusEdges] = useState([]);
    const [busNodes, setBusNodes] = useState([]);
    const [tramEdges, setTramEdges] = useState([]);
    const [tramNodes, setTramNodes] = useState([]);
    const [center, setCenter] = useState([]);

    // getting data from api
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await cityService.getBbox(pos, transport);
            setCenter([data.center[1], data.center[0]]);
            setBusEdges(data.edges.features.filter((el) => (el.properties.highway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setBusNodes(data.nodes.features.filter((el) => (el.properties.bus)).map(item => [item.properties.y, item.properties.x, item.id]));
            setTramEdges(data.edges.features.filter((el) => (el.properties.railway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setTramNodes(data.nodes.features.filter((el) => (el.properties.tram)).map(item => [item.properties.y, item.properties.x, item.id]));
            setLoaded(true);
        }
        fetchData();
    }, [pos, transport]);

    
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
    const rectangle = [[pos.north, pos.west], [pos.south, pos.east]];
    
    // button handling
    function clear() {
        setPositions([]);
        //setPositions([getFromDb]);
    }

    function saveNodes() {
        let nodesData = {};
        if (tramNodes) {
            nodesData.tram = tramNodes.map((el) => [el[0], el[1]]);
        } 
        if (busNodes) {
            nodesData.bus = busNodes.map((el) => [el[0], el[1]]);
        }
        const blob = new Blob([JSON.stringify(nodesData)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); 
        link.download = "nodes.json";
        link.href = url;
        link.click();  
    }

    function saveEdges() {
        let edgesData = {};
        if (tramEdges) {
            edgesData.tram = tramEdges;
        }
        if (busEdges) {
            edgesData.bus = busEdges;
        }
        const blob = new Blob([JSON.stringify(edgesData)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); 
        link.download = "edges.json";
        link.href = url;
        link.click();  
    }

    async function polygonHandle() {
        /* 
        const data = await cityService.postPolygon(positions);
        */
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
            <MapContainer className={styles.Map} center={center} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>Центр города</Popup>
                </Marker>
                <Rectangle bounds={rectangle} pathOptions={blackOptions}/>
                {/* bus */}
                <Polyline pathOptions={busEdgesOptions} positions={busEdges}></Polyline>
                {(busNodes.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[0], el[1]]} radius={10} pathOptions={busNodesOptions}></Circle>
                    )
                ))}
                {/* tram */}
                <Polyline pathOptions={tramEdgesOptions} positions={tramEdges}></Polyline>
                {(tramNodes.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[0], el[1]]} radius={10} pathOptions={tramNodesOptions}></Circle>
                    )
                ))}
                <LocationGetter/>
            </MapContainer>
            <button className={styles.btn} onClick={polygonHandle}>Обработать полигон</button>
            <button className={styles.btn} onClick={clear}>Очистить карту</button>
            <button className={styles.btn} onClick={saveNodes}>Сохранить узлы</button>
            <button className={styles.btn} onClick={saveEdges}>Сохранить рёбра</button>
        </div>
      )
}   


export default RectangleMap