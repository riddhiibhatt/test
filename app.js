import { ReactMediaRecorder } from "react-media-recorder";
import { saveAs } from "file-saver";
import axios from "axios"; 

function App() {
  const handleSave = (blobUrl) => {
    fetch(blobUrl)
      .then((response) => {
        if (!response.ok) {
          console.error("Error fetching blob:", response.statusText);
          throw new Error("Error fetching blob");
        }
        return response.blob();
      })
      .then((blob) => {
        // Send the blob to the backend using Axios
        const formData = new FormData();
        formData.append("audio", blob, "recorded_audio.mp3");

        axios.post("http://localhost:3001/api/upload", formData)
          .then((response) => {
            console.log("Server response:", response.data);
            console.log("Recording saved successfully");
          })
          .catch((error) => {
            console.error("Error saving recording:", error);
          });
      })
      .catch((error) => {
        console.error("Error saving recording:", error);
      });
  };

  return (
    <ReactMediaRecorder
      audio
      render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
        <div>
          <p>{status}</p>
          <button onClick={startRecording} disabled={status === "recording"}>
            Start Recording
          </button>
          <button
            onClick={() => stopRecording(() => handleSave(mediaBlobUrl))}
            disabled={status !== "recording"}
          >
            Stop Recording
          </button>
          <audio src={mediaBlobUrl} controls />
        </div>
      )}
    />
  );
}

export default App;
