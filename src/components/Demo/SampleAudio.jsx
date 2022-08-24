import axios from "axios";
import React, { useEffect, useState } from "react";

function SampleAudio(props) {
    let [previouslySelectedLanguage, setpreviouslySelectedLanguage] =
        useState("none");
    let [selectedValue, setselectedValue] = useState("none");
    let [actualLanguage, setactualLanguage] = useState("Not selected yet");
    let [predictedLanguage, setpredictedLanguage] = useState("Loading");
    let [showFeedback, setshowFeedback] = useState(false);
    let [showAudioElement, setshowAudioElement] = useState(false);

    function handleOnChange(evt) {
        setselectedValue(evt.target.value);
    }

    function handleSend() {
        setpredictedLanguage("Loading");
        setshowFeedback(true);
        setpreviouslySelectedLanguage(selectedValue);
        let BACKEND_HOME_URL = process.env.REACT_APP_BACKEND_HOME_URL;
        let POST_URL = BACKEND_HOME_URL + "/ogdemo";
        let payload = {
            audiofilename: selectedValue,
        };
        axios.post(POST_URL, payload).then((res) => {
            console.log(res);
            setpredictedLanguage(res.data.predicted);
        });
    }

    function hangleAudioFetch() {
        let BACKEND_HOME_URL = process.env.REACT_APP_BACKEND_HOME_URL;
        let POST_URL = BACKEND_HOME_URL + "/ogdemo-getfile";
        let audiohandler = document.getElementById("halwa");
        audiohandler.src = POST_URL + "/" + selectedValue;
        setshowAudioElement(true);
    }

    useEffect(() => {
        if (!props.data) return;
        let code = selectedValue.slice(0, 3);
        let language = props.data.lab2lang[code];
        if (code === "non") setactualLanguage("Not selected yet");
        else setactualLanguage(language);
        console.log(code, language);
        setpredictedLanguage("Submit to view prediction");

        setshowFeedback(false);
        setshowAudioElement(false);
    }, [selectedValue]);
    return (
        <section className="sample-audio">
            <div
                className="send-from-sample-files"
                style={{
                    padding: "10px",
                    margin: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <select
                    className="form-select"
                    style={{
                        height: "100%",
                        padding: "8px 20px",
                    }}
                    aria-label="Default select example"
                    defaultValue={selectedValue}
                    onChange={handleOnChange}
                >
                    <option value="none">Select from sample Files</option>
                    {props.data &&
                        props.data.sampleaudionames.map((ele) => (
                            <option key={ele} value={ele}>
                                {ele}
                            </option>
                        ))}
                </select>
                <button
                    className="btn btn-success"
                    style={{
                        fontSize: "large",
                        padding: "5px 20px",
                        margin: "5px 5px",
                    }}
                    onClick={hangleAudioFetch}
                    disabled={selectedValue === "none"}
                >
                    <i class="fa-solid fa-circle-chevron-down"></i>
                </button>
                <button
                    className="btn btn-primary"
                    style={{
                        fontSize: "large",
                        padding: "5px 20px",
                        margin: "5px 5px",
                    }}
                    onClick={handleSend}
                    disabled={
                        selectedValue === "none" ||
                        selectedValue === previouslySelectedLanguage
                    }
                >
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>
            <div
                className="audio-wrapper"
                style={{
                    width: "100%",
                    display: showAudioElement ? "flex" : "none",
                    justifyContent: "center",
                }}
            >
                <audio id="halwa" src="" controls type="audio/wav"></audio>
            </div>
            <div
                className="actual"
                style={{
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <span>
                    Actual Language: <h2>{actualLanguage}</h2>
                </span>
            </div>
            {showFeedback && (
                <div
                    className="feedback"
                    style={{
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <span>
                        Predicted Language: <h2>{predictedLanguage}</h2>
                    </span>
                </div>
            )}
        </section>
    );
}

export default SampleAudio;
