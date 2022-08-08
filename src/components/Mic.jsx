import React, { useState } from "react";
import "./css/Mic.css";
import axios from "axios";
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
                    Send <i className="fa-solid fa-square-check"></i>
                </button>
                <button>
                    Cancel <i className="fa-solid fa-ban"></i>
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
    axios
        .post("http://localhost:5000/audiorecv", payload)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
}
