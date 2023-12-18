import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import App from "../App/App";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path='/'></Route>
                <Route element={<App/>} path='/app'></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router