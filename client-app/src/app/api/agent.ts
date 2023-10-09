import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Router";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";

axios.defaults.baseURL='http://localhost:5000/api'

const responseBody = <T> (response: AxiosResponse<T>) => response.data

const sleep = (delay: number) => {
    return new Promise((resolve)=>{
        setTimeout(resolve, delay);
    })
}

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;

    return config;
})

axios.interceptors.response.use(responseBody => {
    return responseBody;
}, (error:AxiosError) => {
    const {data, status, config} = error.response! as AxiosResponse;
    console.log(data)
    switch(status){
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                router.navigate('/not-found');
            }
            if(data.errors){
                const errors = [];
                for(const key in data.errors) {
                    if(data.errors[key]) {
                        errors.push(data.errors[key]);
                    }
                }
                throw errors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error("unauthorised");
            break;
        case 403:
            toast.error("forbidden");
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
});

const requests = {
    get: <T> (url: string) => axios.get(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id:string) => requests.post(`/activities/${id}/attend`,{})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const agent ={
    Activities,
    Account
}

export default agent;