const express = require('express')
const app = express();
const db = require('./db');
const router = express.Router();
const busRoute = require('./busRoutes')
const routeRoute = require('./routeRoutes')
const bodyParser = require('body-parser'); 
app.use(bodyParser.json());
app.use('/',busRoute);
app.use('/',routeRoute);

app.use("/", (res,resp)=>{
    resp.json({
        msg : "msg"
    })
})
app.listen(4500);
// git push

// Comment added
