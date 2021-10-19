export interface Photo {
    Id: string;
    Url: string;
    IsMain: boolean;
    UserId: string;
    ProductId: string;
}

export interface UploadResult {
    PublicId: string;
    Url: string;
}