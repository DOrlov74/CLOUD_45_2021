import { Photo } from "./photo";
import { Sale } from "./sale";

export interface User {
    id: string;
    username: string;
    email: string;
    phonenumber: string;
    address: string;
    city: string;
    token: string;
    sales: Sale[];
    photos: Photo[];
}

export interface UserDto {
    username: string;
    email: string;
    password: string;
}

export interface UserContextType {
    user: User|null;
}