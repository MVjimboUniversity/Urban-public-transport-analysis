import React from 'react'
import { useNavigate } from 'react-router';
import styles from './ExistingPage.module.css'
import ExistingMap from '../../components/App/Map/ExistingMap'


function ExistingPage() {
    const navigate = useNavigate();

    // handle back button
    function buttonHandle() {
        // const clearGraph = async () => {
        //     const data = await cityService.clear();
        // }
        // clearGraph();
        navigate('/');
    }

    return (
        <div className={styles.App}>       
            <button className={styles.back} onClick={buttonHandle}> Назад </button>
            <br></br>
            <br></br>
            <br></br>
            <ExistingMap className={styles.Map}></ExistingMap>
        </div>)
}


export default ExistingPage
