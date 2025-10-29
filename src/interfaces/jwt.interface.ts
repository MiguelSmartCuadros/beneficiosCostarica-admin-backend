export interface JwtPayload {
    id_user: number;
    username: string;
    id_user_role: number;
    iat: number;
}

declare global {
    namespace Express {
        export interface Request {
            user_data: JwtPayload;
        }
    }
}
