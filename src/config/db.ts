import { Sequelize, Dialect } from "sequelize";

const database = process.env['DB_NAME'];
const username = process.env['DB_USERNAME'];
const password = process.env['DB_PASSWORD'];

export let sequelize: Sequelize;

export const testDbConnection = async () => {
    try {
        let sequelize: Sequelize = new Sequelize(process.env['DB_NAME'] as string,
            process.env['DB_USERNAME'] as string,
            process.env['DB_PASSWORD'] as string,
            {
                host: process.env['DB_HOST'],
                dialect: 'postgres',
            });
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
