import React, { useState } from "react";
import axios from "axios";

function Feedback(props) {
    let [language_satisfied, setlanguage_satisfied] = useState(true);
    let [feedbacksent, setfeedbacksent] = useState(false);

    let selected_language = null;

    if (feedbacksent)
        return (
            <div id="features" className="text-center">
                <div
                    className="predicted-language"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <h4>The Predicted Language is:&nbsp;&nbsp;&nbsp;</h4>
                </div>
                <div className="container">
                    <div
                        className="col-md-10 col-md-offset-1 section-title"
                        style={{ marginBottom: "10px" }}
                    >
                        <h2>{props.predicted_language}</h2>
                    </div>
                </div>
                <h1 style={{ padding: "30px" }}>Thank You for the Feedback!</h1>
            </div>
        );

    return (
        <section>
            <div id="features" className="text-center">
                <div
                    className="predicted-language"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <h4>The Predicted Language is:&nbsp;&nbsp;&nbsp;</h4>
                </div>
                <div className="container">
                    <div
                        className="col-md-10 col-md-offset-1 section-title"
                        style={{ marginBottom: "10px" }}
                    >
                        <h2>{props.predicted_language}</h2>
                    </div>
                </div>
                <div
                    className="classify"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <h3>Are you Satisfied with the predicted Language?</h3>
                    <div className="buttons">
                        <button
                            className="btn btn-success"
                            style={{ margin: "10px", padding: "5px 30px" }}
                            onClick={() => {
                                selected_language = props.predicted_language;
                                finish();
                            }}
                        >
                            <h4 style={{ color: "white" }}>Yes</h4>
                        </button>
                        <button
                            className="btn btn-danger"
                            style={{ margin: "10px", padding: "5px 32px" }}
                            onClick={() => {
                                setlanguage_satisfied(false);
                            }}
                        >
                            <h4 style={{ color: "white" }}>No</h4>
                        </button>
                    </div>
                    <br />
                    {!language_satisfied && (
                        <>
                            Ok, then which language was that among this?
                            <br />
                            <div
                                className="language-buttons"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    maxWidth: "640px",
                                }}
                            >
                                {renderButtons()}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );

    function finish() {
        send_feedback();

        setTimeout(() => {
            setfeedbacksent(true);
        }, 1000);
    }

    function renderButtons() {
        const languages = [
            "Assamese",
            "Bengali",
            "Gujrati",
            "Hindi",
            "Kannada",
            "Malayalam",
            "Odia",
            "Telugu",
        ];
        let i = 0;
        return (
            <>
                {languages.map((ele) => {
                    i++;
                    return (
                        <>
                            <button
                                key={ele}
                                className="btn btn-primary m-1"
                                style={{
                                    margin: "5px",
                                    width: "150px",
                                }}
                                onClick={() => {
                                    selected_language = ele;
                                    console.log(ele, "selected........");
                                    finish();
                                }}
                            >
                                <h4 style={{ color: "white" }}>{ele}</h4>
                            </button>
                            {i % 2 == 0 ? <br /> : ""}
                        </>
                    );
                })}
            </>
        );
    }
    async function send_feedback() {
        const payload = {
            audiofilename: props.audioFileName,
            actual_lang: selected_language,
        };
        let GLOBAL_URL = process.env.REACT_APP_GLOBAL_URL;
        let POST_URL = GLOBAL_URL + "/feedbackupdate/";
        axios
            .post(POST_URL, payload)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    }
}

export default Feedback;
