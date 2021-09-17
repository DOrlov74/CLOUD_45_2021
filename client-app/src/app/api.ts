import axios, { AxiosResponse } from 'axios';
import { Store } from '../models/store';

const sleep=(delay: number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}
axios.defaults.baseURL='https://localhost:49153/api';
axios.interceptors.response.use(async response=>{
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})
const responseBody=<T>(response: AxiosResponse<T>)=>response.data;
const requests={
    get: <T> (url: string)=> axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {})=> axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {})=> axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string)=> axios.delete<T>(url).then(responseBody),
}
const Stores={
    list: ()=>requests.get<Store[]>('/store'),
    details: (id: string)=>requests.get<Store>(`/store/${id}`),
    create: (store: Store)=>requests.post<Store>('/store', store),
    update: (store: Store)=>requests.put<Store>(`/store/${store.Id}`, store),
    delete: (id: string)=>requests.del<Store>(`/store/${id}`)
}
const api={
    Stores
}
export default api;