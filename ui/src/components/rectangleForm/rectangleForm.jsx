import React from "react";
import styles from '../rectangleForm/RectangleForm.module.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup, Typography, Radio, RadioGroup, FormLabel } from "@mui/material";


// filter to vaildate data
let shape = yup.object().shape({
    top: yup.number().required(),
    bottom: yup.number().required(),
    left: yup.number().required(),
    right: yup.number().required()
})


function RectangleForm() {
    const navigate = useNavigate();

    const [top, setTop] = useState('');
    const [bottom, setBottom] = useState('');
    const [left, setLeft] = useState('');
    const [right, setRight] = useState('');
    const [tramSelected, setTramSelected] = useState(false);
    const [autobusSelected, setAutobusSelected] = useState(false);
    const [trolleybusSelected, setTrolleybusSelected] = useState(false);
    const [connected, setConnected] = useState(false);
    // data to be sent
    let dataToApp = {type : "Rectangle", dataArr: [], transport: {bus: autobusSelected, trolleybus: trolleybusSelected, tram: tramSelected}, connected: false};

    // validating data
    async function validateForm() {
        let dataObject = {
            top: top,
            bottom: bottom,
            left: left, 
            right: right
        };
    
        const isValid = await shape.isValid(dataObject);
    
        if (!isValid) {
            alert("Заполните все поля числами!")
        }
        else {
            dataToApp.dataArr = [{}];
            dataToApp.dataArr[0].north = top;
            dataToApp.dataArr[0].south = bottom;
            dataToApp.dataArr[0].west = left;
            dataToApp.dataArr[0].east = right;
            dataToApp.transport.bus = autobusSelected;
            dataToApp.transport.tram = tramSelected;
            dataToApp.transport.trolleybus = trolleybusSelected;
            dataToApp.connected = connected;
            navigate('/app', {state: dataToApp});
        }
    }

    return (
            <form className={styles.form}>
                <input placeholder="North" onChange={e => setTop(e.target.value)} value = {top}/>
                <input placeholder="South" onChange={e => setBottom(e.target.value)} value = {bottom}/>
                <input placeholder="West" onChange={e => setLeft(e.target.value)} value = {left}></input>
                <input placeholder="East" onChange={e => setRight(e.target.value)} value = {right}></input>
                <div className={styles.asd}>
                    <FormGroup className={styles.CheckboxForm}>   
                        <FormControlLabel control={<Checkbox size="small"/>} label={<Typography fontSize={13}>Автобус</Typography>} 
                        checked={autobusSelected} onChange={(e) => setAutobusSelected(e.target.checked)}/>
                        <FormControlLabel control={<Checkbox size="small"/>} label={<Typography fontSize={13}>Троллейбус</Typography>} 
                        checked={trolleybusSelected} onChange={(e) => setTrolleybusSelected(e.target.checked)}/>
                        <FormControlLabel control={<Checkbox size="small"/>} label={<Typography fontSize={13}>Трамвай</Typography>} 
                        checked={tramSelected} onChange={(e) => setTramSelected(e.target.checked)}/>
                    </FormGroup>
                    <div>
                        <FormLabel component="legend">Граф</FormLabel>
                        <RadioGroup className={styles.CheckboxForm} value={connected} onChange={(e) => setConnected(e.target.value)}>
                            <FormControlLabel value={true} control={<Radio/>} label={<Typography fontSize={13}>Связный</Typography>}></FormControlLabel>
                            <FormControlLabel value={false} control={<Radio/>} label={<Typography fontSize={13}>Несвязный</Typography>}></FormControlLabel>
                        </RadioGroup>
                    </div>
                </div>
                <button type='button' className={styles.btn} onClick={validateForm}>Apply</button>
            </form>
    )
}

export default RectangleForm