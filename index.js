const express = require('express')
const app = express();
// const db = require('./db');
// const router = express.Router();
// const busRoute = require('./busRoutes')
// const routeRoute = require('./routeRoutes')
// const bodyParser = require('body-parser'); 
// app.use(bodyParser.json());
// app.use('/bus',busRoute);
// app.use('/route',routeRoute);

app.get("/",(req,resp)=>{
    return resp.send("Welcome")
})
// app.listen(4500);
// git push

// Comment added