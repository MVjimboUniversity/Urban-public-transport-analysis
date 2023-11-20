import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import App from "../App/App";
import TestMagic from "../testMagic/testMagic"


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path='/'></Route>
                <Route element={<App/>} path='/app'></Route>
                <Route element={<TestMagic/>} path='/test'></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router