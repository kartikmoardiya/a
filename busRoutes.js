const express = require('express')
const app = express()
const router = express.Router()
const Bus = require('./bus')
const Route = require('./route')

// Add new bus
router.post("/new", async (req, resp) => {

    // For Check Bus Exist Or Not 
    const existingUser = await Bus.findOne({ bus: req.body.bus });
    if (existingUser) {
        return resp.status(202).json({ Error: "Bus Already Existing" });
    }

    const currentData = req.body;
    let count = 0;

    // Get all objects of stations
    let stationsArray = currentData.stations;

    // Itreate all the object and give the number of all the station
    stationsArray.forEach((element) => {
        element.busNum = ++count;
    })

    // Save Bus Data
    const data = new Bus(req.body);
    const busData = await data.save();


    // Update in Route Collection
    // Set route of Bus
    const dataForRoute = await Bus.findOne({ bus: req.body.bus });

    let stationsForRoute = dataForRoute.stations;
    let index = 0;
    let numberOfStation = dataForRoute.stations.length - 1;

    for (let i = 0; i < numberOfStation; i++) {
        if (index < numberOfStation) {
            let src = stationsForRoute[i].busStation;
            let dest = stationsForRoute[i + 1].busStation;

            const checkSrcAndDestOfRoute = await Route.findOne({ srcStation: src, destStation: dest });

            if (checkSrcAndDestOfRoute) {
                checkSrcAndDestOfRoute.busNumbers.push({ separateBus: req.body.bus });
                await checkSrcAndDestOfRoute.save();
            } else {
                const temp = {
                    srcStation: src,
                    destStation: dest,
                    busNumbers: [{ separateBus: req.body.bus }]
                }
                const insertRoute = await Route.insertMany(temp);
            }
        }
    }
    return resp.status(200).json({ Message: "Added Successfully" })
})

// Update bus stations at the end of last station
router.put("/add", async (req, resp) => {

    const currentData = req.body;

    // Check Bus Exists or not 
    const existingUser = await Bus.findOne({ bus: '51' });
    if (!existingUser) {
        return resp.status(202).json({ error: 'Bus Not exists' });
    }

    // Before save new data take all the stations wuth their station number --> FirstArray
    const dataFromTable = await Bus.findOne({ bus: '51' });
    let firstArray = dataFromTable.stations

    // For Ordering Purpose get number of avaiable stations
    let count = firstArray.length;


    // Make List of object of stations
    let stationsArray = [];

    let flag = 0;
    // Give station number according to bus
    for (const element of currentData.stations) {

        // // Check all the current stations are already exists or not in database
        let checkStationExits = dataFromTable.stations;
        for (const keys of checkStationExits) {

            // Old and new station match thay to station already existing
            if (keys['busStation'] === element['busStation']) {
                flag = 1;
                break;
            }
        }

        // Old and new station match thay to station already existing
        if (flag === 1) {
            break;
        }
        // console.log({busStation : element['busStation'], busNum : ++count})
        stationsArray.push({ busStation: element['busStation'], busNum: ++count })
    }

    // Old and new station match thay to station already existing
    if (flag == 1) {
        return resp.status(202).json({ Error: "Stations Already Existing" });

    }

    // After getting old and new array update bus stations
    for (const element of stationsArray) {
        dataFromTable.stations.push(element);
    }
    await dataFromTable.save();


    // Update in Route Collection
    // Set route of Bus
    const dataForRoute = await Bus.findOne({ bus: '51' });

    let stationsForRoute = dataForRoute.stations;
    let index = 0;
    let numberOfStation = dataForRoute.stations.length - 1;

    for (let i = 0; i < numberOfStation; i++) {
        if (index < numberOfStation) {
            let src = stationsForRoute[i].busStation;
            let dest = stationsForRoute[i + 1].busStation;

            const checkSrcAndDestOfRoute = await Route.findOne({ srcStation: src, destStation: dest });

            if (checkSrcAndDestOfRoute) {
                checkSrcAndDestOfRoute.busNumbers.push({ separateBus: req.params.bus });
                await checkSrcAndDestOfRoute.save();
            } else {
                const temp = {
                    srcStation: src,
                    destStation: dest,
                    busNumbers: [{ separateBus: req.params.bus }]
                }
                const insertRoute = await Route.insertMany(temp);
            }
        }
    }

    return resp.status(200).json({ Update: "Station Added Successfully" });
})

// Add Stationa at middle
router.put("/add/:src/:dest/:bus", async (req, resp) => {

    const currentData = req.body;

    // Check Bus Exists or not 
    const existingUser = await Bus.findOne({ bus: req.params.bus });
    if (!existingUser) {
        return resp.status(400).json({ Error: 'Bus Not Existing' });
    }

    // Before save new data take all the stations wuth their station number --> FirstArray
    const dataFromTable = await Bus.findOne({ bus: req.params.bus });
    let checkSrcAndDestArray = dataFromTable.stations

    let countSrc = 0;
    let countDest = 0;
    // Give station number according to bus
    for (const element of checkSrcAndDestArray) {
        if (element['busStation'] == req.params.src) {
            countSrc = 1;
        }
        else if (element['busStation'] == req.params.dest) {
            countDest = 1;
        }
    }
    if (countSrc != 1 || countDest != 1) {
        return resp.status(202).json({ Error: "Invalid Source And Destination Stations" });
    }



    let firstArray = [];
    let secondArray = req.body.stations;
    let thirdArray = [];
    let lengthOfSecondArray = req.body.stations.length;
    let lengthOfFirstArray = 0;
    let lengthOfThirdArray = lengthOfSecondArray;



    countSrc = 0;
    countDest = 0;
    for (const element of checkSrcAndDestArray) {
        if (countSrc == 0) {
            if (element['busStation'] == req.params.src) {
                countSrc = 1;
                lengthOfThirdArray = 2 + lengthOfFirstArray + lengthOfSecondArray;
            }
            firstArray.push({ busStation: element['busStation'], busNum: ++lengthOfFirstArray })
        }
        else {
            thirdArray.push({ busStation: element['busStation'], busNum: lengthOfThirdArray++ })
        }
    }

    lengthOfSecondArray = lengthOfFirstArray + 1;
    for (const element of currentData.stations) {
        element.busNum = lengthOfSecondArray++;
    }


    // After getting old and new array update bus stations
    await Bus.updateOne(
        { bus: req.params.bus },
        [
            {
                $set: {
                    stations: {
                        $concatArrays: [firstArray, secondArray, thirdArray]
                    }
                }
            }
        ]
    );

    // Update in Route Collection
    // Set route of Bus
    const dataForRoute = await Bus.findOne({ bus: req.params.bus });

    let stationsForRoute = dataForRoute.stations;
    let index = 0;
    let numberOfStation = dataForRoute.stations.length - 1;

    for (let i = 0; i < numberOfStation; i++) {
        if (index < numberOfStation) {
            let src = stationsForRoute[i].busStation;
            let dest = stationsForRoute[i + 1].busStation;

            const checkSrcAndDestOfRoute = await Route.findOne({ srcStation: src, destStation: dest });

            if (checkSrcAndDestOfRoute) {
                checkSrcAndDestOfRoute.busNumbers.push({ separateBus: req.params.bus });
                await checkSrcAndDestOfRoute.save();
            } else {
                const temp = {
                    srcStation: src,
                    destStation: dest,
                    busNumbers: [{ separateBus: req.params.bus }]
                }
                const insertRoute = await Route.insertMany(temp);
            }
        }
    }

    return resp.status(200).json({ Data: "Stations Added Successfully" });
})


// Delete bus data
router.delete("/delete/:bus", async (req, resp) => {
    const busData = await Bus.findOne({ bus: req.params.bus });
    const stationData = busData.stations;

    for (const element of stationData) {

        // Delete Form Source Station List
        const checkSrcAndDestOfRoute = await Route.findOne({ srcStation: element.busStation });

        if (checkSrcAndDestOfRoute) {
            let deleteBus = checkSrcAndDestOfRoute.busNumbers;

            // console.log(deleteBus)
            // For Delete Bus Number From Src And Dest Chat Gpt code
            const indexToRemove = deleteBus.findIndex((obj) => obj.separateBus === req.params.bus);
            if (indexToRemove !== -1) {
                deleteBus.splice(indexToRemove, 1);
            }
            // console.log(deleteBus)
            await checkSrcAndDestOfRoute.save();
        }

        // Route Data Delete For dest
        const checkSrcAndDestOfRoute1 = await Route.findOne({ destStation: req.params.src });

        if (checkSrcAndDestOfRoute1) {
            let deleteBus = checkSrcAndDestOfRoute1.busNumbers;

            // console.log(deleteBus)
            // For Delete Bus Number From Src And Dest Chat Gpt code
            const indexToRemove = deleteBus.findIndex((obj) => obj.separateBus === req.params.bus);
            if (indexToRemove !== -1) {
                deleteBus.splice(indexToRemove, 1);
            }
            // console.log(deleteBus)
            await checkSrcAndDestOfRoute1.save();

        } else {
            return resp.status(202).json({ Error: "Invalid Stations Entered" });
        }
    }

    const deleteData = await Bus.deleteMany({ bus: req.params.bus });
    return resp.status(200).json({ Delete: "Detele Data Successfully" })
})

router.delete("/station/:src/:bus", async (req, resp) => {
    const dataFromTable = await Bus.findOne({ bus: req.params.bus });
    const deleteStation = dataFromTable.stations;

    if (dataFromTable) {
        const indexToRemove = deleteStation.findIndex((obj) => obj.busStation === req.params.src);
        if (indexToRemove !== -1) {
            deleteStation.splice(indexToRemove, 1);
        }
        await dataFromTable.save();


        // Route Data Delete For Src
        const checkSrcAndDestOfRoute = await Route.findOne({ srcStation: req.params.src });

        if (checkSrcAndDestOfRoute) {
            let deleteBus = checkSrcAndDestOfRoute.busNumbers;

            // console.log(deleteBus)
            // For Delete Bus Number From Src And Dest Chat Gpt code
            const indexToRemove = deleteBus.findIndex((obj) => obj.separateBus === req.params.bus);
            if (indexToRemove !== -1) {
                deleteBus.splice(indexToRemove, 1);
            }
            // console.log(deleteBus)
            await checkSrcAndDestOfRoute.save();

        } else {
            return resp.status(202).json({ Error: "Invalid Source And Destination Stations" });
        }

        // Route Data Delete For Src
        const checkSrcAndDestOfRoute1 = await Route.findOne({ destStation: req.params.src });

        if (checkSrcAndDestOfRoute1) {
            let deleteBus = checkSrcAndDestOfRoute1.busNumbers;

            // console.log(deleteBus)
            // For Delete Bus Number From Src And Dest Chat Gpt code
            const indexToRemove = deleteBus.findIndex((obj) => obj.separateBus === req.params.bus);
            if (indexToRemove !== -1) {
                deleteBus.splice(indexToRemove, 1);
            }
            // console.log(deleteBus)
            await checkSrcAndDestOfRoute1.save();

        } else {
            return resp.status(202).json({ Error: "Invalid Source And Destination Stations" });
        }

        return resp.status(200).json({ Message: "Station Detele Successfully" })
    } else {
        return resp.status(200).json({ Error: "Internal Error" })
    }

})
module.exports = router
