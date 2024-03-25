import { Sequelize } from "sequelize";

const sequelize: Sequelize = new Sequelize(process.env['DB_NAME'] as string,
    process.env['DB_USERNAME'] as string,
    process.env['DB_PASSWORD'] as string,
    {
        host: process.env['DB_HOST'],
        port: Number(process.env['DB_PORT']),
        dialect: 'postgres',
        dialectOptions: {
            supportBigNumbers: true,
            ssl: {
                rejectUnauthorized: false, // Trust the self-signed certificate
            }
        }
    });

module.exports = sequelize