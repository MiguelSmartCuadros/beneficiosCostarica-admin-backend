import { Dialect } from "sequelize";

export interface dataBaseConfig {
    DB_NAME: string;
    USER_NAME: string;
    PASSWORD: string;
    DB_ENDPOINT: string;
    DB_DIALE: Dialect;
    DB_PORT: number;
}
