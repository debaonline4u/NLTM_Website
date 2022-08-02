import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Mic from "./components/Mic";

let MediaStreamRecorder = require("msr");
const mediaConstraints = {
    audio: true,
};

function App() {
    useEffect(() => {
        // alert here
        window.onMediaSuccess = (stream) => {
            window.mediaRecorder = new MediaStreamRecorder(stream);
            window.mediaRecorder.mimeType = "audio/wav"; // check this line for audio/wav
        };

        window.onMediaError = (e) => {
            console.error("media error", e);
        };

        navigator.getUserMedia(
            mediaConstraints,
            window.onMediaSuccess,
            window.onMediaError
        );
    }, []);
    return (
        <div className="App">
            <Header />
            <Mic />
        </div>
    );
}

export default App;
