import React, { useState } from "react";
import styles from './PolygonForm.module.css'
import * as yup from 'yup'
import { useNavigate } from "react-router-dom";

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

    console.log(result);
    return result;
}


function PolygonForm() {
    const [polygon, setPolygon] = useState('')
    const navigate = useNavigate()

    let dataToApp = {type : "Polygon", dataArr: []}

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
                navigate('/app', {state: dataToApp})
            }
        }
    }
    return (
        <form className={styles.form}>
            <input placeholder="Polygon" onChange={e => setPolygon(e.target.value)} value={polygon}></input>
            <button type='button' className={styles.btn} onClick={validateForm} >Apply</button>
        </form>
    )
}

export default PolygonForm