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
    const [numberСentrality, setNumberСentrality] = useState(1);
    //setNumberСentrality(0);
    // passing data to new page
    let dataToApp = {type : "City", dataArr: [], transport: {bus: autobusSelected, trolleybus: trolleybusSelected, tram: tramSelected, subway: subwaySelected}, connected: false, numberСentrality: numberСentrality};

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
            <input  placeholder="Название города" onChange={e => setCity(e.target.value)} value={city} ></input>
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
                    <FormLabel id="rg2" component="legend">Граф</FormLabel>
                    <RadioGroup className={styles.CheckboxForm} value={connected} onChange={(e) => setConnected(e.target.value)}>
                        <FormControlLabel name="rg2" value={true} control={<Radio/>} label={<Typography fontSize={13}>Связный</Typography>}></FormControlLabel>
                        <FormControlLabel name="rg2" value={false} control={<Radio/>} label={<Typography fontSize={13}>Несвязный</Typography>}></FormControlLabel>
                    </RadioGroup>
                </div>
                <div>
                    <FormLabel component="legend">Мера центральности</FormLabel>
                    <RadioGroup id="rg1" className={styles.CheckboxForm} value={numberСentrality} onChange={(e) => setNumberСentrality(e.target.value)} >
                        <FormControlLabel name="rg1" value={1} control={<Radio/>} label={<Typography fontSize={13}>По степени</Typography>} ></FormControlLabel>
                        <FormControlLabel name="rg1" value={2} control={<Radio/>} label={<Typography fontSize={13}>По посредничеству</Typography>}></FormControlLabel>
                        <FormControlLabel name="rg1" value={3} control={<Radio/>} label={<Typography fontSize={13}>По близости</Typography>}></FormControlLabel>
                        <FormControlLabel name="rg1" value={4} control={<Radio/>} label={<Typography fontSize={13}>Page Rank</Typography>}></FormControlLabel>
                    </RadioGroup>
                </div>
            </div>
            <button className={styles.btn} onClick={handler}>Получить данные</button>
        </div>
    )
}

export default CityForm