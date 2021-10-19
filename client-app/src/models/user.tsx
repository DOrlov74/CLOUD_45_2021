import { Photo } from "./photo";
import { Sale } from "./sale";

export interface User {
    Id: string;
    UserName: string;
    Email: string;
    PhoneNumber: string;
    Address: string;
    City: string;
    Token: string;
    Sales: Sale[];
    Photos: Photo[];
    Roles: string[]
}

export interface Role {
    Id: string;
    Name: string;
}

export interface RoleDto {
    Name: string;
}

export interface UserDto {
    UserName: string;
    Email: string;
    Password: string;
}

export interface UserContextType {
    user: User|null;
    setUser: any;
    userRoles: Role[];
    setUserRoles: any;
    roles: Role[];
    setRoles: any;
    userToken: string|null;
    setToken: any;
    getCurrentUser: any;
    photos: Photo[];
    userPhotos: Photo[];
}