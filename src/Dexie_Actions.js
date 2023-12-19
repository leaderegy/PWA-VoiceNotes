import Dexie from "dexie";
//importScripts("node_modules/dexie/dist/dexie.js")
const AllActions = {}

    const INDEXEDDB_NAME = "VoiceDB"
    const TABLES = {
        recordings: {
            tableName: "recordings", 
            columns : {_id:"_id", name:"name", title:"title", audion:"audio", status:"status"}
        }
    }

    function OpenDatabase (){
        const db = new Dexie(INDEXEDDB_NAME)
        db.version(1).stores({recordings: "_id, status",})
        return db
    }

    AllActions.InsertBulk = async function (data){
        try{
            const db = OpenDatabase()
            const rec = db.table(TABLES.recordings.tableName)
            await rec.bulkPut(data)
            db.close()
        }catch (ex){
            console.log("error insert bulk", ex)
        }
    }

    AllActions.Delete = async function (id){
        try{
            const db = OpenDatabase()
            const rec = db.table(TABLES.recordings.tableName)
            rec.delete(id).then((res)=>{
                //console.log("Del Then..", res)
                db.close()
            }).catch((err)=>{
                console.log(err);
            })
        }catch (ex){
            console.log("error delete", ex)
        }
    }

    AllActions.DeleteByStatus = async function (status){
        try{
            const db = OpenDatabase()
            const rec = db.table(TABLES.recordings.tableName)
            rec.where("status").equals(status).delete().then((res)=>{
                //console.log("Del Then..", res)
                db.close()
            }).catch((err)=>{
                console.log(err);
            })
        }catch (ex){
            console.log("error delete", ex)
        }
    }

    AllActions.Update = async function (id, newData){
        try{
            const db = OpenDatabase()
            const rec = db.table(TABLES.recordings.tableName)
            await rec.update(id, newData)
            db.close()
        }catch (ex){
            console.log("error delete", ex)
        }
    }
    
    AllActions.DatabaseExists = async function(){
        // Dexie.exists(INDEXEDDB_NAME).then((exists)=> { 
        //     // console.log(exists)
        //     // return exists;
        // })
        return Dexie.exists(INDEXEDDB_NAME)
    }
    
    AllActions.ReadData = async function (){
        const db = OpenDatabase()
        const rec = db.table(TABLES.recordings.tableName)
        // const result_1 = await rec.where("status").notEqual("0").toArray()
        const result_1 = await rec.orderBy("_id" ).and((item)=> item.status != "0").toArray()

        // console.log(result_1)
        db.close()
        return result_1;
    }

    AllActions.ReadDataByID = async function (id){
        const db = OpenDatabase()
        const rec = db.table(TABLES.recordings.tableName)
        const result_1 = await rec.where("_id").equals(Number(id)).toArray()
        db.close()
        return result_1;
    }

    AllActions.ReadDataByStatus = async function (status){
        const db = OpenDatabase()
        const rec = db.table(TABLES.recordings.tableName)
        // const result_1 = await rec.where("status").equals(status).toArray()
        const result_1 = await rec.where("status").anyOf(status).toArray()
        db.close()
        return result_1;
    }



    // AllActions.GetDataFromServer = async function(){
    //     fetch("http://localhost:4001/api/data")
    //     .then(res => {
    //         if(res.ok){
    //         return res.json()
    //     }else{
    //         const result = AllActions.ReadData();
    //         return result.json()
    //         setData(result)
    //     }
    //   })
    //   .then((data) => {
    //     setData(data), console.log("At..", data)
    //     AllActions.InsertBulk(data)
    //   })
    //   .catch(err => console.log(err))
    // }

export default AllActions
