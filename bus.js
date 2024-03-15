const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    bus : {
        type : String,
        required : true,
        unique : true
    },
    stations : [
        {
            busStation : {
                type : String,
                required : true
            },
            busNum :{
                type : Number,
                required : true
            }
        }
    ]
})

const busModel = mongoose.model('Bus', busSchema);

module.exports = busModel;