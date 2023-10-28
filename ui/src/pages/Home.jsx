import React from "react";
import ChooseForm from "../components/chooseForm/chooseForm";
import styles from './Pages.module.css'

function Home() {
    return (
        <div className={styles.Home}>
            <ChooseForm></ChooseForm>
        </div>
    )
}

export default Home