import React, { useState } from 'react'
import Select from 'react-select'
import RectangleForm from '../rectangleForm/rectangleForm';
import CityForm from '../cityForm/cityForm';
import styles from '../chooseForm/chooseForm.module.css'
import PolygonForm from '../polygonForm/polygonForm';


const style = {
    control: (base, state) => ({
        ...base,

        border: state.isFocused ? '1px solid #8a2be2' : 0,
        transition: 'border-color 0.4s ease',
        // This line disable the blue border
        boxShadow: state.isFocused ? '0 0 10 00000080' : 0,
        height: 40,
        padding: 0,
        outline: 'none',
        marginTop: 0,
        "&:hover": {
          border: state.isFocused ? '1px solid #8a2be2' : 0,
          boxShadow: state.isFocused ? '0 0 10 00000080' : 0,
        },
        fontSize: 15,
    })
}

const options = [
    {value: "Прямоугольник", label: "Rectangle"},
    {value: "Название населённого пункта", label: "City"},
    {value: "Полигон", label: "Polygon"},
];


function ChooseForm() {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    function onChangeHandler(selectedOption) {
        setSelectedOption(selectedOption);
    }
    if (selectedOption.label === "Rectangle") {
        return (
            <div className={styles.Form}> 
                <Select styles={style}
                className={styles.Selector} defaultValue={selectedOption} onChange={onChangeHandler} options={options}></Select>
                <RectangleForm/>
            </div>
        )
    }
    if (selectedOption.label === "Polygon") {
        return (
            <div className={styles.Form}>
                <Select styles={style} 
                className={styles.Selector} defaultValue={selectedOption} onChange={onChangeHandler} options={options}></Select>
                <PolygonForm/>
            </div>
        )
    }
    if (selectedOption.label === "City") {
        return (
            <div className={styles.Form}>
                <Select styles={style} 
                className={styles.Selector} defaultValue={selectedOption} onChange={onChangeHandler} options={options}></Select>
                <CityForm/>
            </div>
        )
    }
}

export default ChooseForm