import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

axios.defaults.baseURL='http://localhost:5000/api'

const responseBody = <T> (response: AxiosResponse<T>) => response.data

const sleep = (delay: number) => {
    return new Promise((resolve)=>{
        setTimeout(resolve, delay);
    })
}

axios.interceptors.response.use(responseBody => {
    return sleep(1000).then(()=>{
        return responseBody;
    }).catch((error) => {
        return Promise.reject(error)
    })
})

const requests = {
    get: <T> (url: string) => axios.get(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post('/activities', activity),
    update: (activity: Activity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

const agent ={
    Activities
}

export default agent;