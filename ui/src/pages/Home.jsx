import React, { useEffect, useState} from "react";
import ChooseForm from "../components/chooseForm/chooseForm";
import styles from './Pages.module.css'
import { useNavigate } from "react-router";
import { cityService } from "../services/city.service";
import HashLoader from "react-spinners/HashLoader";


function Home() {
    const [loaded, setLoaded] = useState(false);
    //const [exists, setExists] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const data = await cityService.dbCheck();
            if (data.is_graph_exist === true) {
                navigate('/App', {state: {type: 'Exists'}});
            }
            setLoaded(true);
        } 
        fetchData();        
    }, [navigate]);

    if (!loaded) {
        return (
            <div className={styles.Home}>
                <div className={styles.Form}>
                    <HashLoader color={'#352F44'} size={100} className={styles.loader}></HashLoader>
                </div>
            </div>
        )
    }
    
    return (
        <div className={styles.Home}>
            <ChooseForm></ChooseForm>
        </div>
    )
}

export default Home