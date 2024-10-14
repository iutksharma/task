import dotenv from 'dotenv';

dotenv.config();

const config = {
    HOST: process.env.HOST,
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD
}

export default config;