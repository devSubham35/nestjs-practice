export interface AuthenticatedUser {
    sub: string
    email: string
    roles: ROLES[]
    isActive: boolean
    isVerified: boolean
}

export enum ROLES {
    USER = "user",
    ADMIN = "admin",
}