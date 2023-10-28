import React, { useState } from "react";
import styles from '../polygonForm/polygonForm.module.css'


function PolygonForm() {
    const [polygon, setPolygon] = useState('')
    
    function onChangeHandler() {
        console.log(`Получены данные: ${polygon}`);
    }
    return (
        <form className={styles.form}>
            <input placeholder="Polygon" onChange={e => setPolygon(e.target.value)} value={polygon}></input>
            <button type='button' className={styles.btn} onClick={onChangeHandler} >Apply</button>
        </form>
    )
}


export default PolygonForm