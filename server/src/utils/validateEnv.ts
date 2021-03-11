import { cleanEnv, port, str } from 'envalid'

const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        JWT_SECRET: str(),
        SERVER_PORT: port(),
        MONGO_CONNECTION: str(),
    })
}

export default validateEnv
