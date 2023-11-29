import React from 'react'
import { useLocation, useNavigate } from 'react-router';
import styles from './App.module.css'
import CityMap from './Map/CityMap';
import RectangleMap from './Map/RectangleMap';
import PolygonMap from './Map/PolygonMap';


function App(props) {
    const navigate = useNavigate();

    // getting data from previous page
    const location = useLocation();
    const type = location.state.type;
    const dataToApp = location.state.dataArr;
    const transport = location.state.transport;


    // handle back button
    function buttonHandle() {
        // const clearGraph = async () => {
        //     const data = await cityService.clear();
        // }
        // clearGraph();
        navigate('/');
    }
    switch (type) {
        case "City":
            return (
                <div className={styles.App}>       
                    <button className={styles.back} onClick={buttonHandle}> Назад </button>
                    <p>Данные с предыдущей страницы</p>
                    <p>Тип предыдущей формы: {type}</p>
                    <p>Получены данные: {dataToApp[0]} </p>
                    <CityMap className={styles.Map} cityname={dataToApp[0]} transport={transport}></CityMap>
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
                    <button className={styles.back} onClick={buttonHandle}> Назад </button>
                        <p>Данные с предыдущей страницы</p>
                        <p>Тип предыдущей формы: {type}</p>
                        <p>Получены данные:<br/> {polygonOutput}</p>
                    </div>       
                <PolygonMap pos={dataToApp} transport={transport}/>
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
                        <button className={styles.back} onClick={buttonHandle}> Назад </button>
                        <p>Данные с предыдущей страницы</p>
                        <p>Тип предыдущей формы: {type}</p>
                        <p>Получены данные:<br/> {output}</p>
                    </div>       
                <RectangleMap pos={rectanglePos} transport={transport}/>
        </div>);
        case 'exists':
            return (
                <PolygonMap pos={dataToApp} transport={transport}/>
            )
        default:
            break;
    }
}

export default App