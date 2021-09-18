export interface User {
    id: string;
    username: string;
    email: string;
    phonenumber: string;
    address: string;
    city: string;
    token: string;
}

export interface UserDto {
    username: string;
    email: string;
    password: string;
}

