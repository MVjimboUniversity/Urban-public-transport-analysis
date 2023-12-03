import axios from "axios"
import { BASE_URL } from ".."


export const cityService = {
    async getAll() {
        const response = await axios.get('https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json')
        
        return response.data
    },
    async getCity(cityName, transport) {
        const response = await axios.get(`http://localhost:80/network/name?city=${cityName}
        &bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`, {withCredentials: true});
        return JSON.parse(response.data);
    },
    async getBbox(bbox, transport) {
        console.log('bb = ', bbox);
        console.log('url = ', BASE_URL + `/network/bbox?north=${bbox.north}&south=${bbox.south}&east=${bbox.east}&west=${bbox.west}&bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`);
        const response = await axios.get(BASE_URL + `/network/bbox?north=${bbox.north}&south=${bbox.south}&east=${bbox.east}&west=${bbox.west}&bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`);
        return JSON.parse(response.data);
    },
    // (37.558093;55.780142) (37.664573;55.724120) (37.584589;55.732905)
    async getPolygon(polygon, transport) {
        const response = await axios.post(BASE_URL + `/network/polygon?bus=${transport.bus}&tram=${transport.tram}&trolleybus=${transport.trolleybus}`, polygon, {headers: {"Content-Type": "application/json"}, withCredentials: true});
        return JSON.parse(response.data);
    }, 
    async dbCheck() {
        const response = await axios.get('http://localhost:80/network/db/check');
        return response.data;
    },
    async getDb() {
        const response = await axios.get('http://localhost/network/db');
        return JSON.parse(response.data);
    }
}