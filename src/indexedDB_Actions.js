const INDEXEDDB_NAME = "VoiceDB"
const TABLES = {
  recordings: {
    tableName: "recordings", 
    columns : {_id:"_id", name:"name", title:"title", audion:"audio"}
  }
}

// function AllActions(){

    function DoAction(){
        var db;
        const dbReq = indexedDB.open(INDEXEDDB_NAME, 1)
        dbReq.onupgradeneeded = function(upgradeEvent){
            db = upgradeEvent.target.result
            db.createObjectStore(TABLES.recordings.tableName, {keyPath : TABLES.id, autoincrement:true})
        }

        dbReq.onsuccess = function(sucessEvent){
        db = sucessEvent.target.result;
        const notesStore = db.transaction([TABLES.recordings.tableName], "readwrite").objectStore(TABLES.recordings.tableName)
        const readRequest = notesStore.get(Number(id))
        readRequest.onsuccess = function(event){
            // console.log(id, allData, allData.target.result.audio)
            const obj = JSON.parse(event.target.result.audio)
            const data = Object.values(obj)
            const uint8Array = new Uint8Array(data);          
            const blob = new Blob([uint8Array], { type: "audio/ogg; codecs=opus" });        
            setBlob(blob)
            }
        }
    }

    function ReadFromMongoDB(){
        fetch("http://localhost:4001/api/data")
        .then((res) => res.json())
        .then((data) => {
            //console.log(data);
            return data;
            // setData(data), console.log("At..", data)
        })
    }

    function InsertIntoIndexedDB(data){
        data.map
    }
    function UpgradeDB(event){
        var db = event.target.result
        db.createObjectStore(TABLES.recordings.tableName, {keyPath : TABLES._id, autoincrement:true})    
    }

    function ReadData(id=null){
        return new Promise(function (resolve, reject){

            var db;
            const dbReq = indexedDB.open(INDEXEDDB_NAME, 1)
            dbReq.onupgradeneeded = function(upgradeEvent){
                //console.log("1..")
                // db = upgradeEvent.target.result
                // db.createObjectStore(TABLES.recordings.tableName, {keyPath : TABLES.id, autoincrement:true})
                UpgradeDB(upgradeEvent)
            }

            dbReq.onsuccess = function(sucessEvent){
                db = sucessEvent.target.result;
                const notesStore = db.transaction([TABLES.recordings.tableName], "readwrite").objectStore(TABLES.recordings.tableName)
                const readRequest = id == null? notesStore.getAll() : notesStore.get(Number(id))
                readRequest.onsuccess = function(event){
                    resolve( event.target.result )
                }

                readRequest.onerror = function(event){
                    reject(event.target.result)
                }
            }

            dbReq.onerror = function (event){
                reject(event.target.result)
            }
        })
    }
// }
export default ReadData