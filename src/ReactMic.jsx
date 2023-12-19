// Import React and useState hook
import React, { useEffect, useState } from "react";

// Import ReactMic component
import { ReactMic } from "react-mic";
import AllActions from "./Dexie_Actions";
import DbActions from "./DbActionsAPIs";

// Create a component for recording voice
const VoiceRecorder = () => {

  // Create a state for recording status
  const [isRecording, setIsRecording] = useState(false);

  // Create a state for audio blob
  let [blob, setBlob] = useState(null);

  const [data, setData] = useState([])

  function getData() {
    try {
      AllActions.DatabaseExists().then((db) => {
        if (db) {
          AllActions.ReadData().then(res => {
            setData(res)
          })
            .catch(err => console.log(err));
        } else {
          fetch("http://localhost:4001/api/data")
            .then(res => {
              if (res.ok) {
                return res.json()
              } else {
                AllActions.ReadData().then(res => {
                  setData(res)
                })
              }
            })
            .then((data) => {

              data.map(item => {
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
              })
              setData(data)
              AllActions.InsertBulk(data)
            })
            .catch(err => {
              AllActions.ReadData().then(res => {
                setData(res)
              })
              console.log("Database server unreachable..", err)
            })
        }
      })
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getData();
  }, [])

  // Define a function to start recording
  const startRecording = async () => {
    setIsRecording(true);
  };

  // Define a function to stop recording
  const stopRecording = () => {
    console.log("Stop recording..")
    setIsRecording(false);
  };

  // Define a function to handle the recorded data
  const onData = (recordedBlob) => {
  };

  // async function deleteFromServer(id) {
  //   return await DbActions.DeleteFromServer(id)
  // }

  const saveNote = (voiceData) => {
    const newTitle = prompt("من فضلك اكتب عنوان الملاحظة", "ملاحظة " + Date.now())

    if (newTitle !== null) {
      voiceData.blob.arrayBuffer().then((res) => {
        const uInt8 = new Uint8Array(res)
        const audioContents = JSON.stringify(uInt8)
        const savedObject = { _id: Date.now(), name: "n" + Date.now(), title: newTitle, audio: audioContents, status: "1" }

        saveToDB(savedObject)
      })
    }
  }

  // async function saveToServer(formDataVoice) {
  //   return await fetch("http://localhost:4001/api/data1", {
  //     method: "POST",
  //     headers: {
  //       // 'enctype': 'multipart/form-data',
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(formDataVoice)
  //   })
  // }

  const saveToDB = (formDataVoice) => {
    DbActions.SaveToServer(formDataVoice)
      .then((res) => {
        if (res.status == 200) {
          insertIntoIndexed(formDataVoice)
          getData();
          console.log('Saved successfully.')
        }
      }).then((data) => {
      }).catch((err) => {
        console.log(err)
        formDataVoice.status = "w"
        insertIntoIndexed(formDataVoice)
        registerSynch("waiting")
        getData();
      })
  };

  function insertIntoIndexed(newData) {
    AllActions.InsertBulk([newData])
  }

  // Define a function to handle the completed recording
  const onStop = async (recordedBlob) => {
    setBlob(recordedBlob.blob);
    saveNote(recordedBlob);
  };

  function Select(id) {
    AllActions.ReadDataByID(id).then(item => {
      const obj = JSON.parse(item[0].audio)
      const data = Object.values(obj)
      const uint8Array = new Uint8Array(data);
      const blob = new Blob([uint8Array], { type: "audio/ogg; codecs=opus" });
      setBlob(blob)
    })
  }

  async function Delete(id) {
    // var result = window.confirm("Are you sure you want to delete this item?");
    var result = window.confirm("هل أنت متأكد من حذف هذا العنصر؟");
    // If the user clicks OK, delete the item
    if (result) {
      try {
        const res = await DbActions.DeleteFromServer(id)

        if (res && res.ok) {
          await AllActions.Delete(Number(id))
          getData()
        } else {
          deleteOffline(id)
        }
      } catch (error) {
        deleteOffline(id)
      }
    }
  }

  async function registerSynch(tag) {
    if ("SyncManager" in window) {
      // get the service worker registration
      navigator.serviceWorker.ready.then(reg => {
        // request a sync event with a tag
        reg.sync.register(tag).then(() => {
          // print a message
          console.log("Sync event waiting...");
        });
      });
    }
  }

  async function deleteOffline(id) {
    await AllActions.Update(Number(id), { status: "0" })
    getData()
    registerSynch("waiting")
  }

  async function SyncFromServer() {
    DbActions.SyncFromServer().then(() => {
      getData();
    })
      .catch((ex) => {
        console.log("err..", ex)
      })
  }

  async function Sync() {
    DbActions.Sync().then((x) => {
      console.log(x)
    })
      .catch((ex) => {
        console.log(ex)
      })
  }

  // Return the JSX element
  return (
    <div>
      <div>
        {/* <h1>Voice Recorder</h1> */}
        <h1>مسجل الملاحظات</h1>
        <hr></hr>
        {
          data.map((item) => (
            <div key={item._id}>
              <span style={{ display: 'inline-block', textAlign: 'right', width: '250px' }}>{item.title}</span>
              <button value={item._id} onClick={(event) => Select(event.target.value)}>o</button>
              <button value={item._id} onClick={(event) => Delete(event.target.value)} >X</button>

            </div>
          ))}
      </div>
      <hr></hr>

      <main>
        <div className="voice-controls">
          <button onClick={startRecording} disabled={isRecording}>
            {/* Start Recording */}
            ابدأ التسجيل
          </button>
          <button onClick={stopRecording} disabled={!isRecording}>
            {/* Stop Recording */}
            أوقف التسجيل
          </button>
          <button onClick={SyncFromServer} >
            {/* Sync from Server */}
            استيراد من الخادم
          </button>
          <button onClick={Sync} >
            {/* Sync */}
            تصدير
          </button>
        </div>
        <div className="voice-visualizer">
          <ReactMic
            record={isRecording}
            className="sound-wave"
            onStop={onStop}
            onData={onData}
            strokeColor="#000000"
            backgroundColor="#FF4081"
          />
        </div>
        {
          blob && (
            <div className="voice-player">
              <audio src={URL.createObjectURL(blob)} controls />
            </div>
          )}

      </main>
    </div>
  );
};

// Export the component
export default VoiceRecorder;