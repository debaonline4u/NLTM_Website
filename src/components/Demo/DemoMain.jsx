import React, { useEffect, useState } from "react";
import "./css/DemoMain.css";
import Feedback from "./Feedback";
import SampleAudio from "./SampleAudio";
import Send from "./Send";
import { Link } from "react-router-dom";
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
          <h2>Spoken Language Identification Demo</h2>
        </div>
      </div>

      {/* <div className="text text-left">
        <p>
          This is a deep neural network (DNN) based language identification
          system designed to identify 12 Indian languages. This model can
          identify <b>Assamase</b>, <b>Bengali</b>, <b>Gujrati</b>, <b>Hindi</b>
          , <b>Kannada</b>, <b>Malayalam</b>, <b>Marathi</b>, <b>Odia</b>,{" "}
          <b>Panjabi</b>, <b>Tamil</b>, <b>Telugu</b> and
          <b> English(Indian)</b>. Some details about these languages can be
          found{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://en.wikipedia.org/wiki/List_of_languages_by_number_of_native_speakers_in_India"
          >
            here
          </a>
          . Here, we use a bidirectional long short-term memory (BLSTM) based
          DNN model. The system contains a feature extractor block to obtain an
          utterance-level embedding of the speech, followed by a language
          classifier block. Both feature extractor and language classifiers are
          trained in an end-to-end fashion using cross-entropy loss function.
        </p>
        <p>
          The features extractor block of the LID system contains a pre trained
          bottleneck feature (BNF) extractor at the front-end to convert the
          speech into a sequence of BNF vectors, followed by two embedding
          extractors to obtain two intermediate utterance-level embeddings.
          These embedding extractors use LID-seq-senones based approach for
          analyzing the speech. These two embedding extractors are designed to
          analyze the input at two different temporal resolutions. Such analysis
          allows them to encode complementary LID-specific contents in the
          speech. The outputs of these two embedding extractors are combined
          together using a self-attention mechanism to get the final
          utterance-level embedding (u-vector). This u-vector is then processed
          by the language classifier to identify the language.
        </p>
      </div>
      <div className="text text-center">
        <h5>More details about this system can be found in these paper.</h5>
        <ul className="list-group">
          <li
            key="Spoken language identification using bidirectional LSTM based LID sequential senones."
            className="list-group-item"
          >
            &nbsp;&nbsp;&nbsp;
            <a href="https://cloud.iitmandi.ac.in/f/ddf6d703924d483e95af/?dl=1">
              <i className="fa-solid fa-file-lines"></i>
              &nbsp;&nbsp; Spoken language identification using bidirectional
              LSTM based LID sequential senones.
            </a>
          </li>
          <li
            key="Spoken language identification in unseen target domain using within-sample similarity loss."
            className="list-group-item"
          >
            &nbsp;&nbsp;&nbsp;
            <a href=" ">
              <i className="fa-solid fa-file-lines"></i>
              &nbsp;&nbsp; Spoken language identification in unseen target
              domain using within-sample similarity loss
            </a>
          </li>
        </ul>
      </div> 
      <div className="container">
        <div
          className="col-md-10 col-md-offset-1 section-title text-center"
          style={{ marginBottom: "0px" }}
        >
          <h2>DEMO</h2>
        </div>
      </div>*/}
      <p>
        This page demonstrates, the identification of an input audio file into
        one of the 12 Indian languages (Assamase, Bengali, Gujrati, Hindi ,
        Kannada, Malayalam, Marathi, Odia, Panjabi, Tamil, Telugu and
        English(Indian)).
        <Link className="page-scroll" to="/info">
          &nbsp;More information.
        </Link>
        <br />
      </p>

      <div className="alert alert-warning" role="alert">
        How to use it?
        <ul
          className="list-group"
          style={{
            textAlign: "left",
          }}
        >
          <li className="list-group-item">
            <i className="fa-solid fa-circle-chevron-right"></i> &nbsp; Click on
            the microphone symbol to record and predict the language.
          </li>
          <li className="list-group-item">
            <i className="fa-solid fa-circle-chevron-right"></i>{" "}
            <strong>
              &nbsp; Please use only one language while speaking and speak
              atleast for 10 seconds.
            </strong>
          </li>
          <li className="list-group-item">
            <i className="fa-solid fa-circle-chevron-right"></i> &nbsp; Click on
            the microphone symbol again to pause the recording.
          </li>
          <li className="list-group-item">
            <i className="fa-solid fa-circle-chevron-right"></i> &nbsp; Click on
            the <b>Predict</b> button and model will predict the language.
          </li>
          <li className="list-group-item">
            <i className="fa-solid fa-circle-chevron-right"></i> &nbsp; If you
            are not satisfied with the language predicted, you can specify the
            correct language.
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
          <div className="tooltip--left sound" data-tooltip="Turn On/Off Sound">
            <div
              className={
                micstatus
                  ? "sound--icon fa-solid fa-microphone"
                  : "sound--icon fa-solid fa-microphone-slash"
              }
            ></div>
          </div>
        </div>
        <h6>
          {micstatus
            ? "Listening..."
            : "Click on the microphone symbol to record and predict the language."}
        </h6>
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
      {/* <span>(or)</span>
      <SampleAudio data={props.data} /> */}
    </section>
  );
}

export default DemoMain;
