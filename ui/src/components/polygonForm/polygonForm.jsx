import React, { useState } from "react";
import styles from './PolygonForm.module.css'
import * as yup from 'yup'
import { useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup, Typography, Radio, RadioGroup, FormLabel } from "@mui/material";


let shape = yup.object().shape({
    polygon: yup.string().required(),
})


// строка вида (x;y) (x;y) ... (x;y)
function parser(str) {
    if (str[0] !== '(' || str.at(-1) !== ')') {
        return null;
    }
    let semicolon = str.indexOf(';', 1);
    if (semicolon === -1) {
        return null;
    }
    let currentIndex = 0;
    let leftBracket = str.indexOf('(');
    if (leftBracket === -1) {
        return null
    }

    let result = [];
    while (leftBracket !== -1) {
        let rightBracket = str.indexOf(')', currentIndex);
        if (rightBracket === -1) {
            return null;
        }
        let x1 = leftBracket + 1;
        let x2 = str.indexOf(';', currentIndex);
        let x = parseFloat(str.slice(x1, x2));

        let y1 = x2 + 1;
        let y2 = rightBracket;
        let y = parseFloat(str.slice(y1, y2));
        result.push([x, y]);

        currentIndex = rightBracket + 1;
        leftBracket = str.indexOf('(', currentIndex);
    }

    return result;
}


function PolygonForm() {
    const navigate = useNavigate()

    const [polygon, setPolygon] = useState('')
    const [tramSelected, setTramSelected] = useState(false);
    const [autobusSelected, setAutobusSelected] = useState(false);
    const [trolleybusSelected, setTrolleybusSelected] = useState(false);
    const [subwaySelected, setSubwaySelected] = useState(false);
    const [connected, setConnected] = useState(false);
    const [numberСentrality, setNumberСentrality] = useState(1);

    let dataToApp = {type : "Polygon", dataArr: [], transport: {bus: autobusSelected, trolleybus: trolleybusSelected, tram: tramSelected, subway: subwaySelected}, connected: false, numberСentrality: numberСentrality};

    async function validateForm() {
        let dataObject = {
            polygon: polygon,
        };

        const isValid = await shape.isValid(dataObject);
    
        if (!isValid) {
            alert("Заполните все поля.");
        }
        else {
            //parser(polygon);
            let data = parser(polygon);
            //let data = null;
            if (data === null) {
                alert("Заполните поле согласно шаблону.");
            }
            else {
                dataToApp.dataArr = [];
                dataToApp.dataArr.push(data);
                dataToApp.transport.bus = autobusSelected;
                dataToApp.transport.trolleybus = trolleybusSelected;
                dataToApp.transport.tram = tramSelected;
                dataToApp.connected = connected;
                navigate('/app', {state: dataToApp});
            }
        }
    }
    return (
        <form className={styles.form}>
            <input placeholder="(x;y) (x;y) ... (x;y)" onChange={e => setPolygon(e.target.value)} value={polygon}></input>
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
            <button type='button' className={styles.btn} onClick={validateForm} >Получить данные</button>
        </form>
    )
}

export default PolygonForm