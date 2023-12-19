import React, { useState } from "react";

// Import MicRecorder package
import MicRecorder from "mic-recorder-to-mp3" 

const AudioNote = () => {
  // Initialize the recorder
  return (
    <div>
      <h1>Audio Note</h1>      
  </div>)
}

// Create a component for recording and saving audio notes
const AudioNote1 = () => {
  // Initialize the recorder
  const recorder = new MicRecorder({
    bitRate: 128,
  });

  // Create a state for recording status
  const [isRecording, setIsRecording] = useState(false);

  // Create a state for audio blob
  const [blob, setBlob] = useState(null);

  // Create a state for error message
  const [error, setError] = useState("");

  // Define a function to start recording
  const startRecording = () => {
    // Request permission to access the microphone
    recorder
      .start()
      .then(() => {
        // Set the recording status to true
        setIsRecording(true);
      })
      .catch((err) => {
        // Set the error message
        setError(err.message);
      });
  };

  // Define a function to stop recording
  const stopRecording = () => {
    // Stop the recorder
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        // Set the recording status to false
        setIsRecording(false);

        // Set the audio blob
        setBlob(blob);
      })
      .catch((err) => {
        // Set the error message
        setError(err.message);
      });
  };

  // Define a function to save the audio note
  const saveNote = () => {
    // Create a form data object
    const formData = new FormData();

    // Append the audio blob and the note title
    formData.append("audio", blob, "note.mp3");
    formData.append("title", "My audio note");

    // Use fetch API to send the form data to the server
    fetch("/api/notes", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        //console.log(data);
      })
      .catch((err) => {
        // Handle the error
        //console.log(err);
      });
  };

  // Return the JSX element
  return (
    <div>
      <h1>Audio Note</h1>
      {error && <p>{error}</p>}
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      {blob && (
        <div>
          <audio src={URL.createObjectURL(blob)} controls />
          <button onClick={saveNote}>Save Note</button>
        </div>
      )}
    </div>
  );
};

// Export the component
export default AudioNote;