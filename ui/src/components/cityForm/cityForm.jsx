import React, { useEffect, useState } from "react";
import { cityService } from '../../services/city.service';
import Select from 'react-select';
import styles from './CityForm.module.css';
import { useNavigate } from "react-router-dom";


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

function CityForm() {
    const [cities, setCities] = useState([])
    
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await cityService.getAll()
            let tempdata = [];
            // filtering cities
            
            for (let i = 0; i < data.length; ++i) {
                if (data[i].population < 100000) {
                    continue;
                }
                let tempObject = {}
                tempObject.value = data[i].name;
                tempObject.label = data[i].name;
                tempObject.lat = data[i].coords.lat;
                tempObject.lon = data[i].coords.lon;
                tempdata.push(tempObject)
            }
            setCities(tempdata)
        }
        fetchData()
    }, [])

    const [selectedOption, setSelectedOption] = useState(cities);
    function onChangeHandler(selectedOption) {
        setSelectedOption(selectedOption);
        console.log(`Selected: ${selectedOption.label}`);
    }
    console.log(selectedOption)
    // passing data to new page
    let dataToApp = {type : "City", dataArr: []};

    const navigate = useNavigate();

    function handler() {
        if (selectedOption.length === 0) {
            alert("Выберите город!");
            navigate('/');
        }
        else {
            dataToApp.dataArr.push(selectedOption);
            navigate('/app', {state: dataToApp})
        }
    }

    return (
        <div className={styles.form}>
            <Select styles={style} className={styles.selected} defaultValue={selectedOption} onChange={onChangeHandler} options={cities}></Select>
            <button className={styles.btn} onClick={handler}>Apply</button>
        </div>
    )
}

export default CityForm