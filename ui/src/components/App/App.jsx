import React from 'react'
import { useLocation } from 'react-router';
import styles from './App.module.css'
import CityMap from './Map/CityMap';
import RectangleMap from './Map/RectangleMap';
import { Link } from 'react-router-dom';
import PolygonMap from './Map/PolygonMap';


function App(props) {
    const location = useLocation()
    const type = location.state.type;
    const dataToApp = location.state.dataArr;
    switch (type) {
        case "City":
            return (
                <div className={styles.App}>       
                    <Link className={styles.back} to={`/`}> Назад </Link>
                    <p>Данные с предыдущей страницы</p>
                    <p>Тип предыдущей формы: {type}</p>
                    <p>Получены данные: {dataToApp[0]} </p>
                    <CityMap className={styles.Map} cityname={dataToApp[0]}></CityMap>
                </div>)
        case "Polygon":
            let polygonPos = [];
            let polygonOutput = '';
            for (let i = 0; i < dataToApp[0].length; ++i) {
                polygonPos[i] = dataToApp[i];
                polygonOutput += dataToApp[0][i][0];
                polygonOutput += ';'
                polygonOutput += dataToApp[0][i][1];
                polygonOutput += ' '
            }
            return (
                <div className={styles.App}>
                    <div className={styles.head}>
                        <Link className={styles.back} to={`/`}> Назад </Link>
                        <p>Данные с предыдущей страницы</p>
                        <p>Тип предыдущей формы: {type}</p>
                        <p>Получены данные:<br/> {polygonOutput}</p>
                    </div>       
                <PolygonMap pos={dataToApp}/>
        </div>)
        case "Rectangle":
            let rectanglePos = [];
            let output = '';
            for (let i = 0; i < 4; ++i) {
                output += dataToApp[i] + ' ';
                rectanglePos.push(dataToApp[i]);
            }
            return (
                <div className={styles.App}>
                    <div className={styles.head}>
                        <Link className={styles.back} to={`/`}> Назад </Link>
                        <p>Данные с предыдущей страницы</p>
                        <p>Тип предыдущей формы: {type}</p>
                        <p>Получены данные:<br/> {output}</p>
                    </div>       
                <RectangleMap pos={rectanglePos}/>
        </div>)
        default:
            break;
    }
}

export default App