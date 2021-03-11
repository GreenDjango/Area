import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import compression from 'compression'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import mongoose from 'mongoose'
import Routes from './interfaces/routes.interface'
import errorMiddleware from './middlewares/error.middleware'
import { stream } from './utils/logger'
import { startTaskUsers } from './models/users.model'
// sudo docker run -d -p 27017:27017 -e MONGO_INITDB_DATABASE=db mongo:latest

class App {
    public app: express.Application
    public port: string | number
    public env: string
    public db: mongoose.Connection
    public mongoDB: string

    constructor(routes: Routes[]) {
        this.app = express()
        this.port = process.env.SERVER_PORT // 9000
        this.env = process.env.NODE_ENV // 'development'
        this.mongoDB = process.env.MONGO_CONNECTION // 'mongodb://localhost:27017/test'

        this.initializeConnectionMongoDB(this.mongoDB)
        this.initializeMiddlewares()
        this.initializeRoutes(routes)
        this.initializeSwagger()
        this.initializeErrorHandling()
    }

    public listen() {
        const serv = this.app.listen(this.port, () => {
            this.port = (serv.address() as any).port || this.port
            console.log(`🚀 App listening at http://localhost:${this.port}`)
        })
    }

    public getServer() {
        return this.app
    }

    private initializeConnectionMongoDB(url: string) {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        mongoose.set('useCreateIndex', true)
        this.db = mongoose.connection
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'))
        this.db.on('open', () => {
            console.log('Connected to mongoDB')
            // TODO: DECOMMENT ME !!!! (for lunch task at start)
            // startTaskUsers()
        })
    }

    private initializeMiddlewares() {
        if (this.env === 'production') {
            this.app.use(morgan('combined', { stream }))
            this.app.use(cors({ origin: true, credentials: true }))
        } else if (this.env === 'development') {
            this.app.use(morgan('dev', { stream }))
            this.app.use(cors({ origin: true, credentials: true }))
        }

        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use('/', route.router)
        })
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Example docs',
                },
            },
            apis: ['swagger.yaml'],
        }

        const specs = swaggerJSDoc(options)
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }
}

export default App
