import axios, { AxiosResponse } from 'axios';
import { Product } from '../models/product';
import { Sale } from '../models/sale';
import { SalesDetail } from '../models/salesdetail';
import { Store } from '../models/store';
import { User, UserDto } from '../models/user';

const sleep=(delay: number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}
axios.defaults.baseURL='https://localhost:49154/api';
// axios.interceptors.response.use(async response=>{
//     try {
//         await sleep(1000);
//         return response;
//     } catch (error) {
//         console.log(error);
//         return await Promise.reject(error);
//     }
// })
const responseBody=<T>(response: AxiosResponse<T>)=>{if(response.status < 300) {return response.data} else {return null}};
const responseListBody=<T>(response: AxiosResponse<T>)=>{if(response.status < 300) {return response.data} else {return []}};
const requests={
    get: <T> (url: string)=> axios.get<T>(url).then(responseBody),
    getList: <T> (url: string)=> axios.get<T>(url).then(responseListBody),
    post: <T> (url: string, body: {})=> axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {})=> axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string)=> axios.delete<T>(url).then(responseBody),
}
const Stores={
    list: ()=>requests.getList<Store[]>('/store'),
    details: (id: string)=>requests.get<Store>(`/store/${id}`),
    create: (store: Store)=>requests.post<Store>('/store', store),
    update: (store: Store)=>requests.put<Store>(`/store/${store.Id}`, store),
    delete: (id: string)=>requests.del<Store>(`/store/${id}`)
}
const Sales={
    list: ()=>requests.getList<Sale[]>('/sale'),
    details: (id: string)=>requests.get<Sale>(`/sale/${id}`),
    create: (sale: Sale)=>requests.post<Sale>('/sale', sale),
    update: (sale: Sale)=>requests.put<Sale>(`/sale/${sale.Id}`, sale),
    delete: (id: string)=>requests.del<Sale>(`/sale/${id}`)
}
const SalesDetails={
    list: ()=>requests.getList<SalesDetail[]>('/salesdetail'),
    details: (id: string)=>requests.get<SalesDetail>(`/salesdetail/${id}`),
    create: (salesDetail: SalesDetail)=>requests.post<SalesDetail>('/salesdetail', salesDetail),
    update: (salesDetail: SalesDetail)=>requests.put<SalesDetail>(`/salesdetail/${salesDetail.Id}`, salesDetail),
    delete: (id: string)=>requests.del<SalesDetail>(`/salesdetail/${id}`)
}
const Products={
    list: ()=>requests.getList<Product[]>('/product'),
    details: (id: string)=>requests.get<Product>(`/product/${id}`),
    create: (sale: Product)=>requests.post<Product>('/product', sale),
    update: (sale: Product)=>requests.put<Product>(`/product/${sale.ProductId}`, sale),
    delete: (id: string)=>requests.del<Product>(`/product/${id}`)
}
const Users={
    list: ()=>requests.getList<User[]>('/user'),
    details: (id: string)=>requests.get<User>(`/user/${id}`),
    create: (user: User)=>requests.post<User>('/user', user),
    update: (user: User)=>requests.put<User>(`/user/${user.id}`, user),
    delete: (id: string)=>requests.del<User>(`/user/${id}`)
}
const Account={
    current: ()=>requests.get<User>('/account'),
    login: (user: UserDto)=>requests.post<User>('/login', user),
    register: (user: UserDto)=>requests.post<User>('/register', user),
    logout: ()=>requests.get('/logout')
}
const api={
    Stores,
    Sales,
    SalesDetails,
    Products,
    Users,
    Account
}
export default api;