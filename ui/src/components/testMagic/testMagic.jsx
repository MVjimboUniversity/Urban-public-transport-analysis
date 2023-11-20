import React from "react";
import { MapContainer, TileLayer,  Polyline, Circle} from 'react-leaflet'
import styles from './testMagic.module.css'
import { Link } from "react-router-dom";


function TestMagic() {
    const geoObject = require('./graph.json');
    const limeOptions = { color: 'lime' }
    let nodes = geoObject.nodes.features.map(item => [item.properties.y, item.properties.x]);
    let edges = geoObject.edges.features.map(item => [item.geometry.coordinates.map((el) => ([el[1], el[0]]))]);
    

    return (
        <div className={styles.App}>
            <Link className={styles.back} to={`/`}> Назад </Link>
            <p>Пробная отрисовка </p>
            <p>Данные:</p>
            <p>Трамвайный граф города Санкт-Петербург</p>
            <div className={styles.map}>
                <MapContainer className={styles.MapContainer} center={[59.920505, 30.343228]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {(nodes.map((el) =>
                (
                    <Circle key={el.id} center={el} radius={10}></Circle>
                )
                ))}
                <Polyline pathOptions={limeOptions} positions={edges}></Polyline>
            </MapContainer>
            </div>
        </div>
    )
}

export default TestMagic
