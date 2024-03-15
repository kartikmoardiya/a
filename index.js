const express = require('express')
const app = express();

app.use("/", (res,resp)=>{
    resp.json({
        msg : "msg"
    })
})

const db = require('./db');
const router = express.Router();
const busRoute = require('./busRoutes')
const routeRoute = require('./routeRoutes')
const bodyParser = require('body-parser'); 
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000; 

app.use('/bus',busRoute);
app.use('/r',routeRoute);

app.listen(PORT);
