import React, { useState } from "react";
import "./css/Mic.css";
var MediaStreamRecorder = require("msr");
let mediaRecorder;
let blobURL, BLOB;
function Mic() {
    let [micstatus, setmicstatus] = useState(false);
    let [class_property_audioplayvisible, class_property_setaudioplayvisible] =
        useState("none");

    function start_recording() {
        let mediaConstraints = {
            audio: true,
        };

        function onMediaSuccess(stream) {
            mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = "audio/wav"; // check this line for audio/wav
            mediaRecorder.ondataavailable = function (blob) {
                // POST/PUT "Blob" using FormData/XHR2
                BLOB = blob;
                blobURL = URL.createObjectURL(blob);
                document.getElementById("player").src = blobURL;
            };
            mediaRecorder.start(30000);
        }

        function onMediaError(e) {
            console.error("media error", e);
        }

        console.log("started!!");
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
    }

    function stop_recording() {
        class_property_setaudioplayvisible("flex");
        console.log("stopped!!");
        mediaRecorder.stop();
    }

    return (
        <section className="mic">
            <div className="container">
                <div
                    className={
                        "toggle-sound " + (micstatus ? "toggle-sound-anim" : "")
                    }
                    onClick={() => {
                        micstatus = !micstatus;
                        if (micstatus) {
                            setmicstatus(true);
                            start_recording();
                        } else {
                            setmicstatus(false);
                            stop_recording();
                        }
                    }}
                >
                    <div
                        className="tooltip--left sound"
                        data-tooltip="Turn On/Off Sound"
                    >
                        <div
                            className={
                                micstatus
                                    ? "sound--icon fa-solid fa-microphone"
                                    : "sound--icon fa-solid fa-microphone-slash"
                            }
                        ></div>
                    </div>
                </div>
                <h1>{micstatus ? "Listening..." : "Not Listening"}</h1>
            </div>

            <section
                style={{ display: class_property_audioplayvisible }}
                className="audioplayer"
            >
                Your Audio:
                <audio id="player" src="" controls="controls"></audio>
                <button
                    onClick={() => {
                        send_data();
                    }}
                >
                    Send <i class="fa-solid fa-square-check"></i>
                </button>
                <button>
                    Cancel <i class="fa-solid fa-ban"></i>
                </button>
            </section>
        </section>
    );
}

export default Mic;
function send_data() {
    const payload = new FormData();
    let currtime = new Date();
    let name = currtime.getTime();
    payload.append("audio", BLOB, name + ".wav");
    fetch("http://localhost:5000/audiorecv", {
        // fetch("https://httpbin.org/post", {
        method: "POST", // or "PUT"
        body: payload,
        // No content-type! With FormData obect, Fetch API sets this automatically.
        // Doing so manually can lead to an error
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
}
