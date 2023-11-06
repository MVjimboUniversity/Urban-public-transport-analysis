import React from "react";
import styles from './RectangleForm.module.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'


// filter to vaildate data
let shape = yup.object().shape({
    top: yup.number().required(),
    bottom: yup.number().required(),
    left: yup.number().required(),
    right: yup.number().required()
})


function RectangleForm() {
    const [top, setTop] = useState('')
    const [bottom, setBottom] = useState('')
    const [left, setLeft] = useState('')
    const [right, setRight] = useState('')

    const navigate = useNavigate()
    // data to be sent
    let data = {type: "Rectangle", dataArr: []}

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
            data.dataArr = [];
            data.dataArr.push(top);
            data.dataArr.push(bottom);
            data.dataArr.push(left);
            data.dataArr.push(right);
            navigate('/app', {state: data});
        }
    }

    return (
            <form className={styles.form}>
                <input placeholder="Top" onChange={e => setTop(e.target.value)} value = {top}/>
                <input placeholder="Bottom" onChange={e => setBottom(e.target.value)} value = {bottom}/>
                <input placeholder="Left" onChange={e => setLeft(e.target.value)} value = {left}></input>
                <input placeholder="Right" onChange={e => setRight(e.target.value)} value = {right}></input>
                <button type='button' className={styles.btn} onClick={validateForm}>Apply</button>
            </form>
    )
}

export default RectangleForm