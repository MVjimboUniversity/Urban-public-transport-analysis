import React, { useState } from "react";
import styles from './cityForm.module.css'
import { useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup, Typography, Radio, RadioGroup, FormLabel } from "@mui/material";


function CityForm() {
    const [city, setCity] = useState('');
    const [tramSelected, setTramSelected] = useState(false);
    const [autobusSelected, setAutobusSelected] = useState(false);
    const [trolleybusSelected, setTrolleybusSelected] = useState(false);
    const [subwaySelected, setSubwaySelected] = useState(false);
    const [connected, setConnected] = useState(false);

    // passing data to new page
    let dataToApp = {type : "City", dataArr: [], transport: {bus: autobusSelected, trolleybus: trolleybusSelected, tram: tramSelected, subway: subwaySelected}, connected: false};

    const navigate = useNavigate();

    function handler() {
        if (city === '') {
            alert("Введите название города!");
            navigate('/');
        }
        else {
            dataToApp.dataArr.push(city);
            dataToApp.transport.bus = autobusSelected;
            dataToApp.transport.trolleybus = trolleybusSelected;
            dataToApp.transport.tram = tramSelected;
            dataToApp.transport.subway = subwaySelected;
            dataToApp.connected = connected;
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
                    <FormControlLabel control={<Checkbox size="small"/>} label={<Typography fontSize={13}>Метро</Typography>} 
                    checked={subwaySelected} onChange={(e) => setSubwaySelected(e.target.checked)}/>
                </FormGroup>
                <div>
                    <FormLabel component="legend">Граф</FormLabel>
                    <RadioGroup className={styles.CheckboxForm} value={connected} onChange={(e) => setConnected(e.target.value)}>
                        <FormControlLabel value={true} control={<Radio/>} label={<Typography fontSize={13}>Связный</Typography>}></FormControlLabel>
                        <FormControlLabel value={false} control={<Radio/>} label={<Typography fontSize={13}>Несвязный</Typography>}></FormControlLabel>
                    </RadioGroup>
                </div>
            </div>
            <button className={styles.btn} onClick={handler}>Apply</button>
        </div>
    )
}

export default CityForm