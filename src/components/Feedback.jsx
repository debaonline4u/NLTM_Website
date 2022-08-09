import React, { useState } from "react";

function Feedback(props) {
    let [feedbacksent, setfeedbacksent] = useState(false);

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
        </section>
    );
}

export default Feedback;
