import axios from "axios"
import { BASE_URL } from ".."

export const cityService = {
    async getAll() {
        const response = await axios.get('https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json')
        
        return response.data
    },
    async getCity() {
        console.log('Trying to get response');
        const response = await axios.get(BASE_URL + '/tests/TramNetwork?city=Санкт-Петербург');
        console.log('response = ',  response.data);
        return response.data;
    }
}