import React, { useState } from "react";
import styles from './cityForm.module.css'
import { useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup, Typography } from "@mui/material";


function CityForm() {
    const [city, setCity] = useState('');
    const [tramSelected, setTramSelected] = useState(false);
    const [autobusSelected, setAutobusSelected] = useState(false);
    const [trolleybusSelected, setTrolleybusSelected] = useState(false);

    // passing data to new page
    let dataToApp = {type : "City", dataArr: [], transport: {autobus: autobusSelected, trolleybus: trolleybusSelected, tram: tramSelected}};

    const navigate = useNavigate();

    function handler() {
        if (city === '') {
            alert("Введите название города!");
            navigate('/');
        }
        else {
            dataToApp.dataArr.push(city);
            dataToApp.autobus = autobusSelected;
            dataToApp.trolleybus = trolleybusSelected;
            dataToApp.tram = tramSelected;
            navigate('/app', {state: dataToApp})
        }
    }

    return (
        <div className={styles.form}>
            <input placeholder="Название города" onChange={e => setCity(e.target.value)} value={city} ></input>
            <div className={styles.asd}>
                <FormGroup className={styles.CheckboxForm}>   
                    <FormControlLabel control={<Checkbox size="small"/>} label={<Typography fontSize={13}>Автобус</Typography>} 
                    checked={autobusSelected} onChange={(e) => setAutobusSelected(e.target.checked)}/>
                    <FormControlLabel control={<Checkbox size="small"/>} label={<Typography fontSize={13}>Троллейбус</Typography>} 
                    checked={trolleybusSelected} onChange={(e) => setTrolleybusSelected(e.target.checked)}/>
                    <FormControlLabel control={<Checkbox size="small"/>} label={<Typography fontSize={13}>Трамвай</Typography>} 
                    checked={tramSelected} onChange={(e) => setTramSelected(e.target.checked)}/>
                </FormGroup>
            </div>
            <button className={styles.btn} onClick={handler}>Apply</button>
            {/* <button className={styles.btn} onClick={toMagic}>testMagic</button> */}
        </div>
    )
}

export default CityForm