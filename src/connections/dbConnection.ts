import { Sequelize } from "sequelize";
import { dataBaseConfig } from "../interfaces/dataBase.interface";

if (
    !process.env.DB_ENDPOINT ||
    !process.env.USER_NAME ||
    !process.env.PASSWORD ||
    !process.env.DB_NAME ||
    !process.env.DB_PORT
) {
    const error = 
        "Environment variable for database are missing. Make sure to configure dataBaseConfig in your .env file";
    console.error(error);
    throw new Error(error);
}
const paramsDataBase: dataBaseConfig = {
    DB_NAME: process.env.DB_NAME as string,
    USER_NAME: process.env.USER_NAME as string,
    PASSWORD: process.env.PASSWORD as string,
    DB_ENDPOINT: process.env.DB_ENDPOINT as string,
    DB_DIALE: "mysql",
    DB_PORT: Number(process.env.DB_PORT),
};

export const dbConnection: Sequelize = new Sequelize (
    paramsDataBase.DB_NAME,
    paramsDataBase.USER_NAME,
    paramsDataBase.PASSWORD,
    {
        host: paramsDataBase.DB_ENDPOINT,
        dialect: paramsDataBase.DB_DIALE,
        logging: false,
        port: paramsDataBase.DB_PORT,
    }
);

