import { Sequelize } from "sequelize";

const sequelize: Sequelize = new Sequelize(process.env['DB_NAME'] as string,
    process.env['DB_USERNAME'] as string,
    process.env['DB_PASSWORD'] as string,
    {
        host: process.env['DB_HOST'],
        port : Number(process.env['DB_PORT']),
        dialect: 'postgres',
    });

module.exports = sequelize