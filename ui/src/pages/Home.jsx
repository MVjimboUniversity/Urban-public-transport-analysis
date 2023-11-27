import React, { useEffect, useState} from "react";
import ChooseForm from "../components/chooseForm/chooseForm";
import styles from './Pages.module.css'
import { useNavigate } from "react-router";
import { cityService } from "../services/city.service";


function Home() {
    const [exists, setExists] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const data = cityService.dbCheck();
            console.log('at home', data);
            setExists(data);
            setLoaded(true);
            if (data === true) {
                navigate('/app');
            }
        } 
        fetchData();
    }, []);

    if (!loaded) {
        return (
            <div className={styles.Home}></div>
        )
    }
    
    return (
        <div className={styles.Home}>
            <ChooseForm></ChooseForm>
        </div>
    )
}

export default Home