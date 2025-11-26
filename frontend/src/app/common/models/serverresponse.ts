export interface Serverresponse {
    success: boolean,
    data: string | { 
        email: string,
        id: number,
        name: string,
        phoneNumber: string,
        role: string,
        forgetpassAt?: null | any
    },
    message?: string,
    error?: {
        message: string,
        code: string | number
    }
}