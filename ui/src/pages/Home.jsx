import React, { useEffect, useState} from "react";
import ChooseForm from "../components/chooseForm/chooseForm";
import styles from './Pages.module.css'
import { useNavigate } from "react-router";


function Home() {
    const [exists, setExists] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const data = false;
            setExists(data);
        } 
        fetchData();
    }, []);

    if (exists) {
        navigate('/app');
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