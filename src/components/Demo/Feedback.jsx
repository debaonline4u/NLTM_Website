import React, { useState } from "react";
import axios from "axios";

function Feedback(props) {
    let [language_satisfied, setlanguage_satisfied] = useState(true);
    let [feedbacksent, setfeedbacksent] = useState(false);

    let selected_language = null;

    if (feedbacksent)
        return (
            <>
                <h5>Thank You for the Feedback!</h5>
            </>
        );

    return (
        <section>
            <div className="predicted-language">
                The Predicted Language is:
                <button
                    className="btn btn-outline-success m-2"
                    type="button"
                    style={{
                        color: "white",
                    }}
                    disabled
                >
                    {props.predicted_language}
                </button>
            </div>
            <div className="classify">
                Are you Satisfied with the predicted Language?
                <button
                    className="btn btn-success m-2"
                    onClick={() => {
                        selected_language = props.predicted_language;
                        finish();
                    }}
                >
                    Yes
                </button>
                <button
                    className="btn btn-danger m-1"
                    onClick={() => {
                        setlanguage_satisfied(false);
                    }}
                >
                    No
                </button>
                <br />
                {!language_satisfied && (
                    <>
                        Ok, then which language was that among this?
                        <br />
                        {renderButtons()}
                    </>
                )}
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
        return (
            <>
                {languages.map((ele) => (
                    <button
                        key={ele}
                        className="btn btn-primary m-1"
                        onClick={() => {
                            selected_language = ele;
                            console.log(ele, "selected........");
                            finish();
                        }}
                    >
                        {ele}
                    </button>
                ))}
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
