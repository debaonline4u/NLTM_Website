import React, { useEffect, useState } from "react";
import "./css/DemoMain.css";
import Feedback from "./Feedback";
import SampleAudio from "./SampleAudio";
import Send from "./Send";
var MediaStreamRecorder = require("msr");

let mediaRecorder;
let blobURL;

function DemoMain(props) {
    let [micstatus, setmicstatus] = useState(false);
    let [disable_mic, set_disable_mic] = useState(false);
    let [show_send_wrapper, set_show_send_wrapper] = useState(false);
    let [predicted_language, set_predicted_language] = useState("");
    let [audioFileName, setAudioFileName] = useState("");
    let [showFeedback, setshowFeedback] = useState(false);
    let auto_close_handler;
    let [retry, setretry] = useState(0);
    useEffect(() => {
        // Get the micrphone access
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
                    blobURL = URL.createObjectURL(blob);
                    // document.getElementById("player").src = blobURL;
                };
            },
            (e) => {
                alert("We need the microphone access, for showing the Demo");
                console.error("media error", e);
            }
        );
    }, [retry]);
    function start_recording() {
        // if microphone access was not available do a retry
        if (!mediaRecorder) {
            setretry(++retry);
            return;
        }

        setmicstatus(true);
        mediaRecorder.start(process.env.REACT_APP_MAX_TIME_LIMIT + 1000); // taking 1 sec extra for buffer
        console.log("started!!");
        auto_close_handler = setTimeout(() => {
            stop_recording();
        }, process.env.REACT_APP_MAX_TIME_LIMIT);
    }

    function stop_recording() {
        clearTimeout(auto_close_handler);
        setmicstatus(false);
        set_disable_mic(true);
        set_show_send_wrapper(true);
        console.log("stopped!!");
        mediaRecorder.stop();
    }

    return (
        <section
            className="mic"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11pt",
                maxWidth: "1200px",
                padding: "50px",
            }}
        >
            <div className="container">
                <div
                    className="col-md-10 col-md-offset-1 section-title text-center"
                    style={{ marginBottom: "0px" }}
                >
                    <h2>
                        Spoken Language <br /> Identify
                    </h2>
                </div>
            </div>

            <div className="text text-left">
                <p>
                    This is a Deep Neural Network (DNN) based Language
                    Identification system designed to identify 8 Indian
                    languages. This model can identify Assamase, Bengali,
                    Gujrati, Hindi, Kannada, Malayalam, Odia and Telugu. Some
                    details about these languages can be found{" "}
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers_in_India"
                    >
                        here
                    </a>
                    . Here, we use a bidirectional long short-term memory
                    (BLSTM) based DNN model. In this system, the input speech is
                    first converted into a sequence of bottelneck features
                    (BNFs). The BLSTM layers in the DNN then analyse this
                    sequence of BNFs by dividing it into fixed-length chunks
                    (each chunk ~600 ms) to produce LID-seq-senones. Each
                    LID-seq-senone is a compact representation of the given
                    fixed-lingth chunk. These LID-seq-senones are then processed
                    by a self-attention block, which assigns a weightage to each
                    of these LID-seq-senones based on their relevance to the LID
                    task. Using these attention values, weighted average of
                    these LID-seq-senones are then computed to obtain an
                    utterance-level representation of the speech (called
                    u-vector). This u-vector is then processed by the output
                    layer to identify the language.
                </p>
            </div>
            <div className="text text-center">
                <h5>
                    More details about this system can be found in these papers.
                </h5>
                <ul className="list-group">
                    {props.data &&
                        props.data.papers.map((ele) => (
                            <li key={ele.name} className="list-group-item">
                                &nbsp;&nbsp;&nbsp;
                                <a href={ele.url}>
                                    <i className="fa-solid fa-file-lines"></i>
                                    &nbsp;&nbsp;
                                    {ele.name}
                                </a>
                            </li>
                        ))}
                </ul>
            </div>
            <div className="container">
                <div
                    className="col-md-10 col-md-offset-1 section-title text-center"
                    style={{ marginBottom: "0px" }}
                >
                    <h2>DEMO</h2>
                </div>
            </div>
            <p>{props.data && props.data.info}</p>

            <div className="alert alert-warning" role="alert">
                How to use it?
                <ul
                    className="list-group"
                    style={{
                        textAlign: "left",
                    }}
                >
                    <li className="list-group-item">
                        <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                        &nbsp; Clicking on the microphone will start recording.
                    </li>
                    <li className="list-group-item">
                        <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                        <strong>
                            &nbsp; Please use only one language while speaking.
                        </strong>
                    </li>
                    <li className="list-group-item">
                        <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                        &nbsp; Click on the mic again to pause the recording.
                    </li>
                    <li className="list-group-item">
                        <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                        &nbsp; Clicking on the send button. Our Model will
                        predict the language.
                    </li>
                    <li className="list-group-item">
                        <i className="fa-solid fa-circle-chevron-right"></i>{" "}
                        &nbsp; If you are not satisfied with the language
                        predicted, you can select the right language.
                    </li>
                </ul>
            </div>

            <div className="container-2">
                <div
                    className={
                        "toggle-sound " +
                        (micstatus ? "toggle-sound-anim " : "") +
                        (disable_mic ? " disable" : "")
                    }
                    onClick={() => {
                        if (disable_mic) return;
                        micstatus = !micstatus;
                        if (micstatus) {
                            start_recording();
                        } else {
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

            {show_send_wrapper && (
                <div
                    className="send-wrapper"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Send
                        blobURL={blobURL}
                        set_predicted_language={set_predicted_language}
                        setAudioFileName={setAudioFileName}
                        setshowFeedback={setshowFeedback}
                        set_show_send_wrapper={set_show_send_wrapper}
                        set_disable_mic={set_disable_mic}
                    />

                    {showFeedback ? (
                        <>
                            <Feedback
                                predicted_language={predicted_language}
                                audioFileName={audioFileName}
                                data={props.data}
                            />
                        </>
                    ) : (
                        ""
                    )}
                </div>
            )}
            <span>(or)</span>
            <SampleAudio data={props.data} />
        </section>
    );
}

export default DemoMain;
