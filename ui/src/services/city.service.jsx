import axios from "axios"
import { BASE_URL } from ".."


export const cityService = {
    async getCity(cityName, transport, connected) {
        console.log('response = ', `http://localhost:80/network/name?city=${cityName}&connected=${connected}&bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`);
        const response = await axios.get(`http://localhost:80/network/name?city=${cityName}&connected=${connected}&bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`, {withCredentials: true});
        return JSON.parse(response.data);
    },
    async getBbox(bbox, transport, connected) {
        console.log('bb = ', bbox);
        console.log('url = ', BASE_URL + `/network/bbox?connected=${connected}&north=${bbox.north}&south=${bbox.south}&east=${bbox.east}&west=${bbox.west}&bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`);
        const response = await axios.get(BASE_URL + `/network/bbox??connected=${connected}&north=${bbox.north}&south=${bbox.south}&east=${bbox.east}&west=${bbox.west}&bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`);
        return JSON.parse(response.data);
    },
    // (37.558093;55.780142) (37.664573;55.724120) (37.584589;55.732905)
    async getPolygon(polygon, transport, connected) {
        const response = await axios.post(BASE_URL + `/network/polygon?connected=${connected}&bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`, polygon, {headers: {"Content-Type": "application/json"}, withCredentials: true});
        return JSON.parse(response.data);
    }, 
    async dbCheck() {
        const response = await axios.get('http://localhost:80/network/db/check');
        return response.data;
    },
    async getDb() {
        const response = await axios.post('http://localhost:80/network/db');
        return JSON.parse(response.data);
    },
    async deleteGraph() {
        const response = await axios.get('http://localhost:80/network/db/delete');
        return response.data;
    },
    async userDb(positions) {
        const response = await axios.post('http://localhost:80/network/db', positions);
        return JSON.parse(response.data);
    }
}