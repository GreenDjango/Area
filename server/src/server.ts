import 'dotenv/config'
import App from './app'
import AuthRoute from './routes/auth.route'
import OAuthRoute from './routes/oauth.route'
import IndexRoute from './routes/index.route'
import validateEnv from './utils/validateEnv'
import ActionRoute from './routes/action.route'
import ServiceRoute from './routes/service.route'

validateEnv()

const app = new App([new IndexRoute(), new AuthRoute(), new OAuthRoute(), new ActionRoute(), new ServiceRoute()])

app.listen()
