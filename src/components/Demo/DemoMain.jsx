import React, { useEffect, useState } from "react";
import "./css/DemoMain.css";
import Feedback from "./Feedback";
import Send from "./Send";
var MediaStreamRecorder = require("msr");

let mediaRecorder;
let blobURL, BLOB;

function Mic() {
    let [micstatus, setmicstatus] = useState(false);
    let [show_send_wrapper, set_show_send_wrapper] = useState(false);
    let [predicted_language, set_predicted_language] = useState("");
    let [audioFileName, setAudioFileName] = useState("");
    let [showFeedback, setshowFeedback] = useState(false);

    useEffect(() => {
        let mediaConstraints = {
            audio: true,
        };
        navigator.getUserMedia(
            mediaConstraints,
            (stream) => {
                mediaRecorder = new MediaStreamRecorder(stream);
                mediaRecorder.mimeType = "audio/wav"; // check this line for audio/wav
                mediaRecorder.ondataavailable = function (blob) {
                    // POST/PUT "Blob" using FormData/XHR2
                    BLOB = blob;
                    blobURL = URL.createObjectURL(blob);
                    document.getElementById("player").src = blobURL;
                };
            },
            (e) => {
                console.error("media error", e);
            }
        );
    }, []);
    function start_recording() {
        mediaRecorder.start(30000);
        console.log("started!!");
    }

    function stop_recording() {
        set_show_send_wrapper(true);
        console.log("stopped!!");
        mediaRecorder.stop();
    }

    return (
        <section className="mic">
            <div className="container-2">
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

            <div
                className="send-wrapper"
                style={{
                    display: show_send_wrapper ? "flex" : "none",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Send
                    set_predicted_language={set_predicted_language}
                    setAudioFileName={setAudioFileName}
                    setshowFeedback={setshowFeedback}
                />
                {showFeedback ? (
                    <Feedback
                        predicted_language={predicted_language}
                        audioFileName={audioFileName}
                    />
                ) : (
                    ""
                )}
            </div>
        </section>
    );
}

export default Mic;
