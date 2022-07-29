import React, { useState } from "react";
import "./css/Mic.css";
let tracks, recorder, context, audio;

function Mic() {
    let [micstatus, setmicstatus] = useState(false);
    let [audioplayvisible, setaudioplayvisible] = useState("none");

    function start_recording() {
        audio = document.getElementById("player");
        // Detecte the correct AudioContext for the browser
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
        let mediaConstraints = {
            audio: true,
        };

        function onMediaError(e) {
            alert("Error " + e);
            console.log("Rejected!", e);
        }

        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(function (stream) {
                console.log("Recording...");
                tracks = stream.getTracks();

                context = new AudioContext();
                let mediaStreamSource = context.createMediaStreamSource(stream);
                recorder = new window.recorder(mediaStreamSource);
                recorder.record();
            })
            .catch(function (err) {
                /* handle the error */
                onMediaError(err);
            });
    }

    function stop_recording() {
        setaudioplayvisible("flex");
        console.log("Stop Recording...");
        recorder.stop();
        tracks.forEach((track) => track.stop());
        recorder.exportWAV(function (s) {
            audio.src = window.URL.createObjectURL(s);
            console.log(s);
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
                                "sound--icon fa-solid " +
                                (micstatus
                                    ? "fa-microphone"
                                    : "fa-microphone-slash")
                            }
                        ></div>
                    </div>
                </div>
                <h1>{micstatus ? "Listening..." : "Not Listening"}</h1>
            </div>

            <section
                style={{ display: audioplayvisible }}
                className="audioplayer"
            >
                Your Audio:
                <audio id="player" src="" controls="controls"></audio>
            </section>
        </section>
    );
}

export default Mic;
