import React from "react";
import styles from '../rectangleForm/rectangleForm.module.css'
import { useState } from "react";


function RectangleForm() {
    const [top, setTop] = useState('')
    const [bottom, setBottom] = useState('')
    const [left, setLeft] = useState('')
    const [right, setRight] = useState('')
    

    function onChangeHandler() {
        console.log("top = ", top);
        console.log("bottom = ", bottom);
        console.log("left = ", left);
        console.log("right = ", right);
    }

    return (
            <form className={styles.form}>
                <input placeholder="Top" onChange={e => setTop(e.target.value)} value = {top}/>
                <input placeholder="Bottom" onChange={e => setBottom(e.target.value)} value = {bottom}/>
                <input placeholder="Left" onChange={e => setLeft(e.target.value)} value = {left}></input>
                <input placeholder="Right" onChange={e => setRight(e.target.value)} value = {right}></input>
                <button type='button' className={styles.btn} onClick={onChangeHandler}>Apply</button>
            </form>
    )
}

export default RectangleForm