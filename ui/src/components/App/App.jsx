import React, {useState} from 'react'
import { useLocation, useNavigate } from 'react-router';
import styles from './App.module.css'
import CityMap from './Map/CityMap';
// import RectangleMap from './Map/RectangleMap';
// import PolygonMap from './Map/PolygonMap';
import { cityService } from '../../services/city.service';
import { useEffect } from 'react';
import HashLoader from "react-spinners/HashLoader";


function App(props) {
    const navigate = useNavigate();

    // getting data from previous page
    const location = useLocation();
    const type = location.state.type;
    const dataToApp = location.state.dataArr;
    const transport = location.state.transport;

    const [loaded, setLoaded] = useState(false);
    const [busEdges, setBusEdges] = useState([]);
    const [busNodes, setBusNodes] = useState([]);
    const [tramEdges, setTramEdges] = useState([]);
    const [tramNodes, setTramNodes] = useState([]);
    const [center, setCenter] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let data = {};
            console.log('type = ', type);
            switch (type) {
                case 'City':
                    data = await cityService.getCity(dataToApp[0], transport);
                    console.log('City', data);
                    break;
                case 'Polygon':
                    data = await cityService.getPolygon(dataToApp[0], transport);
                    console.log('Polygon', data);
                    break;
                case 'Rectangle':
                    data = await cityService.getBbox(dataToApp[0], transport);
                    console.log('Rectangle', data);
                    break;
                case 'Exists':
                    data = await cityService.getDb();
                    console.log('Exists', data);
                    break;
                default: 
                    break;
            }
            setCenter([data.center[1], data.center[0]]);
            setBusEdges(data.edges.features.filter((el) => (el.properties.highway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setBusNodes(data.nodes.features.filter((el) => (el.properties.bus)).map(item => [item.properties.y, item.properties.x, item.id]));
            setTramEdges(data.edges.features.filter((el) => (el.properties.railway)).map(item => item.geometry.coordinates.map((el) => ([el[1], el[0]]))));
            setTramNodes(data.nodes.features.filter((el) => (el.properties.tram)).map(item => [item.properties.y, item.properties.x, item.id]));
            setLoaded(true);            
        }
        fetchData();
    }, [type, transport, dataToApp]);

    // handle back button
    function buttonHandle() {
        const clearGraph = async () => {
            const data = await cityService.deleteGraph();
            if (data) {
                console.log(data.detail);
            }
        }
        clearGraph();
        navigate('/');
    }
    if (!loaded) {
        return (
            <div className={styles.App}>       
                <button className={styles.back} onClick={buttonHandle}> Назад </button>
                <br></br>
                <br></br>
                <br></br>
                <div className={styles.MapContainer}>
                    <HashLoader color={'#352F44'} size={100} className={styles.loader}></HashLoader>   
                </div>
            </div>)
    }
    return (
        <div className={styles.App}>       
            <button className={styles.back} onClick={buttonHandle}> Назад </button>
            {/* <p>Данные с предыдущей страницы</p>
            <p>Тип предыдущей формы: {type}</p>
            <p>Получены данные: {dataToApp[0]} </p> */}
            <br></br>
            <br></br>
            <CityMap className={styles.Map} transport={transport} isLoaded={loaded} tramNodes={tramNodes} tramEdges={tramEdges} busNodes={busNodes}
            busEdges={busEdges} center={center}></CityMap>
        </div>)

    // switch (type) {
    //     case "City":
    //         return (
    //             <div className={styles.App}>       
    //                 <button className={styles.back} onClick={buttonHandle}> Назад </button>
    //                 {/* <p>Данные с предыдущей страницы</p>
    //                 <p>Тип предыдущей формы: {type}</p>
    //                 <p>Получены данные: {dataToApp[0]} </p> */}
    //                 <br></br>
    //                 <br></br>
    //                 <br></br>
    //                 <CityMap className={styles.Map} cityname={dataToApp[0]} transport={transport}></CityMap>
    //             </div>)
        // case "Polygon":
        //     let polygonPos = [];
        //     let polygonOutput = '';
        //     for (let i = 0; i < dataToApp[0].length; ++i) {
        //         polygonPos[i] = dataToApp[i];
        //         polygonOutput += dataToApp[0][i][0];
        //         polygonOutput += ';'
        //         polygonOutput += dataToApp[0][i][1];
        //         polygonOutput += ' '
        //     }
        //     return (
        //         <div className={styles.App}>
        //             <div className={styles.head}>
        //             <button className={styles.back} onClick={buttonHandle}> Назад </button>
        //             <br></br>
        //             <br></br>
        //             <br></br>
        //             </div>       
        //         <PolygonMap pos={dataToApp} transport={transport}/>
        // </div>)
        // case "Rectangle":
        //     return (
        //         <div className={styles.App}>
        //             <div className={styles.head}>
        //                 <button className={styles.back} onClick={buttonHandle}> Назад </button>
        //                 <br></br>
        //                 <br></br>
        //                 <br></br>
        //             </div>       
        //         <RectangleMap pos={rectanglePos} transport={transport}/>
        // </div>);
    //     case 'exists':
    //         return (
    //             <div className={styles.App}>
    //                 <div className={styles.head}>
    //                     <button className={styles.back} onClick={buttonHandle}> Назад </button>
    //                     <br></br>
    //                     <br></br>
    //                     <br></br>
    //                 </div>       
    //                 <CityMap transport={transport} exists={true}/>
    //             </div>
    //         )
    //     default:
    //         break;
    // }
}

export default App