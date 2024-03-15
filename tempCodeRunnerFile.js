/db');
const router = express.Router();
const busRoute = require('./busRoutes')
const routeRoute = require('./routeRoutes')
const bodyParser = require('body-parser'); 
app.use(bodyParser.json());
app.use('/',busRoute);
app.use('/',route