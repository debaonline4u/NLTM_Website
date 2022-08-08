import React, { useState } from "react";
import "./css/Mic.css";
let blobURL, BLOB;

function Mic() {
    let [micstatus, setmicstatus] = useState(false);
    let [class_property_audioplayvisible, class_property_setaudioplayvisible] =
        useState("none");

    function start_recording() {
        console.log(window.recorderJSAudioRecoder);
        window.recorderJSAudioRecoder.record();
        console.log("started!!");
    }

    function stop_recording() {
        window.recorderJSAudioRecoder.stop();
        class_property_setaudioplayvisible("flex");
        window.recorderJSAudioRecoder.exportWAV((blob) => {
            // POST/PUT "Blob" using FormData/XHR2
            console.log(">>>>>>>>>> Tadaaaaaaaaaaa!!!!!");
            BLOB = blob;
            blobURL = URL.createObjectURL(blob);
            document.getElementById("player").src = blobURL;
        });
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
