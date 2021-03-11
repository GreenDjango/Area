import axios from 'axios'
import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'
import queryString from 'query-string'

// ? IN
// lat
// long
// ? Out
// Meteo String
export default class MeteoTask extends ATask {
    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.METEO, data, input)
    }

    private static async getMeteo(lat: string, long: string): Promise<any> {
        return axios
            .get(
                queryString.stringifyUrl({
                    url: 'https://api.openweathermap.org/data/2.5/weather',
                    query: {
                        lat: lat,
                        lon: long,
                        units: 'metric',
                        appid: 'f468bfc3224552251aba05d42c646ab0',
                    },
                })
            )
            .then((res) => {
                return res.data
            })
    }

    public async _run(dep: properties): Promise<properties> {
        const lat = dep.get('lat') || this.data.get('lat')
        const long = dep.get('long') || this.data.get('long')
        if (!lat || !long) throw '[Meteo-Task] - Invalid arg'
        const meteo = await MeteoTask.getMeteo(lat, long)

        return new Map<string, any>([
            ['weather', `Name: ${meteo.name}\nTemperature: ${meteo.main?.temp}°C\nWeather: ${meteo.weather[0]?.description}`],
        ])
    }
}
