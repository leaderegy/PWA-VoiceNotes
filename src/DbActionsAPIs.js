import { Error } from "mongoose";
import AllActions from "./Dexie_Actions";

const DbActions = {}

DbActions.ReadFromServer = async function () {
    let result = null
    let error = null

    try {
        //"1.1..")
        const res = await fetch("http://localhost:4001/api/data")
        //console.log("1.2..", res)
        if (res && res.ok) {
            //console.log("2..", res)
            const data = await res.json()
            //res.json(data => {
            for (let item of data) {

                // data.map(item => {
                var audio = item.audio.data
                let result = "";
                // Loop through each element of the array
                for (let element of audio) {
                    // Convert the ASCII number to a character using String.fromCharCode
                    let character = String.fromCharCode(element);
                    // Append the character to the result string
                    result += character;
                }
                item.audio = result
                //})
            }
            //console.log("Data1..", data)
            //return data;
            result = data
            //})
            // .catch(err => {
            //     console.log("err1..", err)
            //     return err
            // })
        } else {
            console.log("No result..", res)
            error = new Error("No result")
        }
    } catch (ex) {
        console.log("err..", ex)
        //return ex;
        error = ex
    }

    return new Promise((resolve, reject) => {
        if (error) {
            reject(error)
        } else {
            resolve(result)
        }
    })
    //return fetch("http://localhost:4001/api/data")
}

DbActions.DeleteFromServer = async function (id) {
    //console.log("delete")
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

    let result = null;
    let error = null;

    try {
        const waitingData = await AllActions.ReadDataByStatus(["0", "w"])

        for (let itm of waitingData) {
            //console.log("i..", itm._id, itm.status, itm.title)

            if (itm.status == "w") {
                itm.status = "1"
            }

            result = itm.status == "0" ? await DbActions.DeleteFromServer(itm._id) : await DbActions.SaveToServer(itm);
            if (result && result.ok) {
                itm.status == "1" ? AllActions.Update(itm._id, itm) : AllActions.Delete(itm._id)
            } else {
                console.log("Error..", result)
                error = new Error("Error during deleting or saving some items to server.")
            }
        }
    } catch (ex) {
        console.log("Error..", ex)
        error = ex
    }

    return new Promise((resolve, reject) => {
        if(error){
            reject(error)
        }else{
            resolve(result == null? "No items to sync.." : result)
        }
        // if (result && result.ok) {
        //     resolve(result)
        // } else {
        //     reject(new Error("Failed to connect.."))
        // }
    });
}

DbActions.SyncFromServer = async function () {
    try {
        const data = await DbActions.ReadFromServer()
        //console.log(data)
        await AllActions.DeleteByStatus("1")
        return await AllActions.InsertBulk(data)

        // if (res && res.ok) {
        //     const data = await res.json()
        //     await AllActions.DeleteByStatus("1")
        // } else {
        //     console.log("res..", res)
        // }
    } catch (ex) {
        console.log(ex)
    }

    // DbActions.ReadFromServer().
    //     then(res => {
    //         res.json()
    //             .then(data => {
    //                 console.log(data)
    //                 AllActions.DeleteByStatus("1").then(() => {
    //                     return AllActions.InsertBulk(data)
    //                 })
    //                     .catch((err) => console.log(err))
    //             })
    //     })
}

export default DbActions
