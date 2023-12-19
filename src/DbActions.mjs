// Delete this file

import AllActions from "./Dexie_Actions.js";
import mongoose from "mongoose";
// const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/VoiceDB");
//mongoose.connect("mongodb+srv://MongoUser01:qZeKStklgVhuop26@notes.fe7lhgm.mongodb.net/VoiceDB");

const dbConnection = mongoose.connection
dbConnection.on('error', (error) => console.log(error))
dbConnection.on('open', () => console.log('Connected to Database!'))


// Define the schema and model for the data collection
const DataSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  audio: Buffer,
  title: String,
  status: String
});

const Data = mongoose.model("Recording", DataSchema);





const DbActions = {}

DbActions.ReadFromServer = async function(){
    //return fetch("http://localhost:4001/api/data")
    return await Data.find();
}

DbActions.DeleteFromServer = async function (id) {
    return await Data.findByIdAndDelete(id);
    console.log("delete")
    return await fetch(`http://localhost:4001/api/data/${id}`, {
        method: "DELETE"
        // ,
        // headers: {
        //   // 'enctype': 'multipart/form-data',
        //   "Content-Type": "application/json",
        // }
        // ,
        // body: JSON.stringify(formDataVoice)
    })
}

DbActions.SaveToServer = async function (objectToSave) {
    const data = new Data(objectToSave);
    return await data.save();
    return await fetch("http://localhost:4001/api/data1", {
        method: "POST",
        headers: {
            // 'enctype': 'multipart/form-data',
            "Content-Type": "application/json",
        },
        body: JSON.stringify(objectToSave)
    })
}

DbActions.Sync = async function () {
    const waitingData = await AllActions.ReadDataByStatus(["0", "w"])

    for (let itm of waitingData) {
        //console.log("i..", itm._id, itm.status, itm.title)
        try {
            if (itm.status == "w") {
                itm.status = "1"
            }

            let result = itm.status == "0" ? await DbActions.DeleteFromServer(itm._id) : await DbActions.SaveToServer(itm);
            if (result && result.ok) {
                itm.status == "1" ? AllActions.Update(itm._id, itm) : AllActions.Delete(itm._id)
            } else {
                console.log("Error..", result)
            }

        } catch (ex) {
            console.log("Error..", ex)
        }
    }
}

AllActions.SyncFromServer = async function(){
    const newData = await DbActions.ReadFromServer()

    await AllActions.InsertBulk(newData)
}
export default DbActions
