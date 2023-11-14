import axios from "axios"

export const cityService = {
    async getAll() {
        const response = await axios.get('https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json')
        
        return response.data
    },
    async getCity(cityName) {
        const response = await axios.get('http://localhost:80/tests/TramNetwork?city=' + cityName, {withCredentials: true});
        console.log("response = ", JSON.parse(response.data));
        return JSON.parse(response.data);
    }
}