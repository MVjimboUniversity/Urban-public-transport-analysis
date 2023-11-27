import axios from "axios"
import { BASE_URL } from ".."


export const cityService = {
    async getAll() {
        const response = await axios.get('https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json')
        
        return response.data
    },
    async getCity(cityName) {
        const response = await axios.get('http://localhost:80/network/name?city=' + cityName, {withCredentials: true});
        return JSON.parse(response.data);
    },
    async getBbox(bbox) {
        const response = await axios.get(BASE_URL + `/TramNetwork/bbox?north=${bbox.north}&south=${bbox.south}&east=${bbox.east}&west=${bbox.west}`);
        return JSON.parse(response.data);
    },
    // (37.558093;55.780142) (37.664573;55.724120) (37.584589;55.732905)
    async getPolygon(polygon) {
        const response = await axios.post(BASE_URL + '/TramNetwork/polygon', polygon, {headers: {"Content-Type": "application/json"}, withCredentials: true});
        return JSON.parse(response.data);
    }
}