const express = require('express')
const app = express()
const router = express.Router()
const Bus = require('./bus')
const Route = require('./route')

// get all the detail about buses which are aviable for current src and dest stations
router.get("/getdetail/:src", async (req, resp) => {
    const checkSrcOfRoute = await Route.find({ srcStation: req.params.src });
    const checkDestOfRoute = await Route.find({ destStation: req.params.src });
    if (checkSrcOfRoute) {
        if (checkSrcOfRoute.length === 0) {
            if (checkDestOfRoute) {
                let tempArr = [];
                if (checkDestOfRoute.length !== 0) {
                    for (const element of checkDestOfRoute[0].busNumbers) {
                        tempArr.push({separateBus:element.separateBus});
                    }
                    return resp.status(200).json({
                        busNumbers:tempArr
                    })
                }
                return resp.status(400).json({
                    Error : "Internal Server Error"
                })
            }
        }
        let temp = [];
        for (const element of checkSrcOfRoute[0].busNumbers) {
            temp.push({separateBus:element.separateBus});
        }
        return resp.status(200).json({
            busNumbers : temp
        })
    }
    return resp.status(400).json({
        Error: "Entered Valid Source"
    })

})

router.get("/getallstation/:bus", async (req, resp) => {
    const getallstation = await Bus.find({ bus: req.params.bus });// one type of aaray male
    if (getallstation) {


        let stations = [];
        for (const element of getallstation[0].stations) {
            const temp = element.busStation
            stations.push({ busStation: temp, busNum: element.busNum });
        }

        const data = {
            bus: getallstation[0].bus,
            stations :stations
        }
        return resp.status(200).json({
            data
        })
    }
    return resp.status(400).json({
        Error: "Bus Not Found Internal Server Problem"
    })
})
module.exports = router