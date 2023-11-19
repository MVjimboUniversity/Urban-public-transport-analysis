import React, { useState } from "react";
import styles from './cityForm.module.css'
import { useNavigate } from "react-router-dom";


function CityForm() {
    const [city, setCity] = useState('');
    
    // passing data to new page
    let dataToApp = {type : "City", dataArr: []};

    const navigate = useNavigate();

    function handler() {
        if (city === '') {
            alert("Введите название города!");
            navigate('/');
        }
        else {
            dataToApp.dataArr.push(city);
            navigate('/app', {state: dataToApp})
        }
    }

    function toMagic() {
        navigate('/test');
    }

    return (
        <div className={styles.form}>
            <input placeholder="Название города" onChange={e => setCity(e.target.value)} value={city} ></input>
            <button className={styles.btn} onClick={handler}>Apply</button>
            <button className={styles.btn} onClick={toMagic}>testMagic</button>
        </div>
    )
}

export default CityForm