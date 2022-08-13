import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Send.css";
const UPLOAD_STATUS = {
    STOPPED: 0,
    UPLOADING: 1,
    UPLOADED: 2,
};

function Send(props) {
    let [STATUS, setSTATUS] = useState(UPLOAD_STATUS.STOPPED);
    let [loaderPercent, setloaderPercent] = useState(0);
    let [uploadText, setuploadText] = useState("");
    let [send_button_disabled, set_send_button_disabled] = useState(false);
    useEffect(() => {
        console.log("Status changed...");
        switch (STATUS) {
            case UPLOAD_STATUS.STOPPED:
                setuploadText("");
                break;
            case UPLOAD_STATUS.UPLOADING:
                setuploadText("UPLOADING...");
                break;
            case UPLOAD_STATUS.UPLOADED:
                setuploadText("UPLOADED");
                break;
            default:
                break;
        }
    }, [STATUS]);
    return (
        <section className="audioplayer">
            <span>Your Audio:</span>

            <audio id="player" src={props.blobURL} controls="controls"></audio>

            {STATUS !== UPLOAD_STATUS.STOPPED && (
                <>
                    <span>{uploadText}</span>
                    <div className="loader">
                        <div
                            className="sub-loader"
                            style={{ width: loaderPercent + "%" }}
                        ></div>
                    </div>
                </>
            )}
            <div className="send-controls">
                <button
                    className="btn btn-success"
                    style={{ margin: "10px" }}
                    onClick={() => {
                        set_send_button_disabled(true);
                        console.log(send_button_disabled);
                        send_data();
                        setSTATUS(UPLOAD_STATUS.UPLOADING);
                    }}
                    disabled={send_button_disabled}
                >
                    <h4 style={{ color: "white" }}>
                        Send &nbsp;&nbsp;&nbsp;
                        <i className="fa-solid fa-square-check"></i>
                    </h4>
                </button>
                <button
                    onClick={() => {
                        cancel();
                    }}
                    className="btn btn-danger"
                    style={{ margin: "10px" }}
                    disabled={STATUS !== UPLOAD_STATUS.STOPPED}
                >
                    <h4 style={{ color: "white" }}>
                        Clear&nbsp; <i className="fa-solid fa-ban"></i>
                    </h4>
                </button>
            </div>
        </section>
    );

    function cancel() {
        document.getElementById("player").src = null;
        setSTATUS(UPLOAD_STATUS.STOPPED);
        set_send_button_disabled(false);
        props.setshowFeedback(false);
        props.set_show_send_wrapper(false);
        props.set_disable_mic(false);
    }

    async function send_data() {
        let blobURL = document.getElementById("player").src;

        let BLOB = await fetch(blobURL).then((r) => r.blob());
        const payload = new FormData();
        let currtime = new Date();
        let name = currtime.getTime();
        name = name + ".wav";
        props.setAudioFileName(name);
        payload.append("audio", BLOB, name);

        const options = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                setloaderPercent(Math.floor((loaded * 100) / total));
                console.log(
                    loaded + "kb of " + total + "kb | " + loaderPercent
                );
                if (loaded === total) {
                    setSTATUS(UPLOAD_STATUS.UPLOADED);

                    // automatically reset the upload after 5s to stopped so as to remove the progress bar from UI
                    console.log("Setting Timeout for 5s");
                    setTimeout(() => {
                        console.log("Timeout function got executed...");
                        setSTATUS(UPLOAD_STATUS.STOPPED);
                    }, 5000);
                }
            },
        };

        let GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;
        let POST_URL = GLOBAL_URL + "/audiorecv";

        axios
            .post(POST_URL, payload, options)
            .then((res) => {
                console.log(res.data);
                props.set_predicted_language(res.data.predicted_lang);
                props.setshowFeedback(true);
            })
            .catch((err) => console.log(err));
    }
}
export default Send;
