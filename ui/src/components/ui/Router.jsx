import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import App from "../App/App";
import ExistingPage from "../../pages/ExistingMap/ExistingPage";


const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path='/'></Route>
                <Route element={<App/>} path='/app'></Route>
                <Route element={<ExistingPage/>} path='/existing-map'></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router