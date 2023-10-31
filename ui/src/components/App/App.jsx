import React from 'react'
import { useLocation } from 'react-router';
import styles from './App.module.css'
import CityMap from './Map/CityMap';
import { Link } from 'react-router-dom';



function App(props) {
    const location = useLocation()
    const type = location.state.type;
    const dataToApp = location.state.dataArr;
    console.log(dataToApp)
    switch (type) {
        case "City":
            return (
                <div className={styles.App}>       
                    <Link className={styles.back} to={`/`}> Назад </Link>
                    <p>Данные с предыдущей страницы</p>
                    <p>Тип предыдущей формы: {type}</p>
                    <p>Получены данные: {dataToApp[0].value} </p>
                     <CityMap className={styles.Map} pos={[dataToApp[0].lat, dataToApp[0].lon]}></CityMap>
                </div>)
        default:
            break;
    }
}

export default App