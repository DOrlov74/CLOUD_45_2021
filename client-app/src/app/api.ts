import axios, { AxiosResponse } from 'axios';
import { Family } from '../models/family';
import { Product } from '../models/product';
import { Sale } from '../models/sale';
import { SalesDetail } from '../models/salesdetail';
import { Store } from '../models/store';
import { Role, RoleDto, User, UserDto } from '../models/user';

const sleep=(delay: number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL='http://localhost:5000/api';
axios.interceptors.request.use(config => {
    const token = window.localStorage.getItem('jwt');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})
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
    update: (sale: Sale)=>requests.put<Sale>(`/sale/${sale.SaleId}`, sale),
    delete: (id: string)=>requests.del<Sale>(`/sale/${id}`)
}
const SalesDetails={
    list: ()=>requests.getList<SalesDetail[]>('/salesdetail'),
    details: (id: string)=>requests.get<SalesDetail>(`/salesdetail/${id}`),
    create: (salesDetail: SalesDetail)=>requests.post<SalesDetail>('/salesdetail', salesDetail),
    update: (salesDetail: SalesDetail)=>requests.put<SalesDetail>(`/salesdetail/${salesDetail.SalesDetailId}`, salesDetail),
    delete: (id: string)=>requests.del<SalesDetail>(`/salesdetail/${id}`)
}
const Products={
    list: ()=>requests.getList<Product[]>('/product'),
    details: (id: string)=>requests.get<Product>(`/product/${id}`),
    create: (product: Product)=>requests.post<Product>('/product', product),
    update: (product: Product)=>requests.put<Product>(`/product/${product.ProductId}`, product),
    delete: (id: string)=>requests.del<Product>(`/product/${id}`)
}
const Families={
    list: ()=>requests.getList<Family[]>('/family'),
    details: (id: string)=>requests.get<Family>(`/family/${id}`),
    create: (family: Family)=>requests.post<Family>('/family', family),
    update: (family: Family)=>requests.put<Family>(`/family/${family.FamilyId}`, family),
    delete: (id: string)=>requests.del<Family>(`/family/${id}`)
}
const Users={
    //list: ()=>requests.getList<User[]>('/user'),
    current: ()=>requests.get<User>('/user'),
    details: (id: string)=>requests.get<User>(`/user/${id}`),
    create: (user: User)=>requests.post<User>('/user', user),
    update: (user: User)=>requests.put<User>(`/user/${user.Id}`, user),
    delete: (id: string)=>requests.del<User>(`/user/${id}`)
}
const Roles={
    list: ()=>requests.getList<Role[]>('/user/role'),
    details: (id: string)=>requests.get<Role>(`/user/role/${id}`),
    create: (role: RoleDto)=>requests.post<Role>('/user/role', role),
    addrole: (id: string, role: Role)=>requests.post<User>(`/user/role/${id}`, role),
    delete: (id: string)=>requests.del<Role>(`/user/role/${id}`)
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
    Families,
    Users,
    Roles,
    Account
}
export default api;