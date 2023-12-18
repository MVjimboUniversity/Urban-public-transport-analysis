import React, { useState } from "react";
import styles from '../Map/Map.module.css'
import { MapContainer, TileLayer, Polyline, Circle, Polygon, useMapEvents} from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";
import { cityService } from "../../../services/city.service";
// import HashLoader from "react-spinners/HashLoader";



function CityMap({cityname, transport, exists, isLoaded, tramNodes, tramEdges, busNodes, busEdges, center}) {
    const tramEdgesOptions = { color: 'red' };
    const tramNodesOptions = { color: 'darkred'};
    const busEdgesOptions = { color: '#398bff' };
    const busNodesOptions = { color: 'darkblue' };
    const redOptions = {color: 'black'};
    
    const [tramNodes_, setTramNodes] = useState(tramNodes);
    const [tramEdges_, setTramEdges] = useState(tramEdges);
    const [busNodes_, setBusNodes] = useState(busNodes);
    const [busEdges_, setBusEdges] = useState(busEdges);
    // useEffect(() => {
    //     setTramNodes(tramNodes1);
    // }, []);

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
        let data = {};
        if (positions.length === 0) {
            data = await cityService.getDb();
        }
        else {
            let userPolygon = positions.map((el) => [el.lng, el.lat]);
            userPolygon.push([positions[0].lng, positions[0].lat]);
            data = await cityService.userDb(userPolygon);
        }
        center = [await data.center[1], await data.center[0]];
        setTramEdges(data.edges.features.filter((el) => (el.properties.railway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
        setTramNodes(data.nodes.features.filter((el) => (el.properties.tram)).map(item => [item.properties.y, item.properties.x, item.id]));
        setBusNodes(data.nodes.features.filter((el) => (el.properties.bus)).map(item => [item.properties.y, item.properties.x, item.id]));
        setBusEdges(data.edges.features.filter((el) => (el.properties.highway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]])))); 
    }
    // useEffect( () => {
    //     const fetchData = async () => {
    //         let data = {};
    //         if (!exists) {
    //             data = await cityService.getCity(cityname, transport);
    //         }
    //         else {
    //             data = await cityService.getDb();
    //         }
    //         console.log('transport = ', data);
    //         setCenter([data.center[1], data.center[0]]);
    //         setBusEdges(data.edges.features.filter((el) => (el.properties.highway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
    //         setBusNodes(data.nodes.features.filter((el) => (el.properties.bus)).map(item => [item.properties.y, item.properties.x, item.id]));
    //         setTramEdges(data.edges.features.filter((el) => (el.properties.railway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
    //         setTramNodes(data.nodes.features.filter((el) => (el.properties.tram)).map(item => [item.properties.y, item.properties.x, item.id]));
    //         setIsLoaded(true);
    //     }
    //     fetchData();
    // },  [cityname, transport, exists]);
    // console.log('asdadd', tramEdges);

    return (
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
                {/* bus */}
                <Polyline pathOptions={busEdgesOptions} positions={busEdges_}></Polyline>
                {(busNodes_.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[0], el[1]]} radius={10} pathOptions={busNodesOptions}></Circle>
                    )
                ))}
                {/* tram */}
                <Polyline pathOptions={tramEdgesOptions} positions={tramEdges_}></Polyline>
                {(tramNodes_.map((el) =>
                    (
                        <Circle key={el[2]} center={[el[0], el[1]]} radius={10} pathOptions={tramNodesOptions}></Circle>
                    )
                ))}
                <Polygon pathOptions={redOptions} positions={positions}></Polygon>
            </MapContainer>
            <button className={styles.btn} onClick={polygonHandle}>Обработать полигон</button>
            <button className={styles.btn} onClick={clear}>Очистить карту</button>
            <button className={styles.btn} onClick={saveNodes}>Сохранить узлы</button>
            <button className={styles.btn} onClick={saveEdges}>Сохранить рёбра</button>
            <div className={styles.legend}>
                <div className={styles.legendElement}>
                    <hr className={styles.redline}></hr>
                    <span className={styles.objectname}>Трамвайный путь</span>
                </div>
                <div className={styles.legendElement}>
                    <div className={styles.redstop}></div>
                    <span className={styles.objectname}>Трамвайная остановка</span>
                </div>
                <div className={styles.legendElement}>
                    <hr className={styles.blueline}></hr>
                    <span className={styles.objectname}>Автобусный путь</span>
                </div>
                <div className={styles.legendElement}>
                    <div className={styles.bluestop}></div>
                    <span className={styles.objectname}>Автобусная остановка</span>
                </div>
            </div>
        </div>
  )
}

export default CityMap