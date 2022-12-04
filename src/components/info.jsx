export const Info = (props) => {
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
      <div id="info">
        <div className="container">
          <div
            className="col-md-10 col-md-offset-1 section-title text-center"
            style={{ marginBottom: "0px" }}
          >
            <h2>Spoken Language Identification</h2>
          </div>
        </div>

        <div className="text text-left">
          <p>
            This is a deep neural network (DNN) based language identification
            system designed to identify 12 Indian languages. This model can
            identify <b>Assamase</b>, <b>Bengali</b>, <b>Gujrati</b>,{" "}
            <b>Hindi</b>, <b>Kannada</b>, <b>Malayalam</b>, <b>Marathi</b>,{" "}
            <b>Odia</b>, <b>Panjabi</b>, <b>Tamil</b>, <b>Telugu</b> and
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
            DNN model. The system contains a feature extractor block to obtain
            an utterance-level embedding of the speech, followed by a language
            classifier block. Both feature extractor and language classifiers
            are trained in an end-to-end fashion using cross-entropy loss
            function.
          </p>
          <p>
            The features extractor block of the LID system contains a pre
            trained bottleneck feature (BNF) extractor at the front-end to
            convert the speech into a sequence of BNF vectors, followed by two
            embedding extractors to obtain two intermediate utterance-level
            embeddings. These embedding extractors use LID-seq-senones based
            approach for analyzing the speech. These two embedding extractors
            are designed to analyze the input at two different temporal
            resolutions. Such analysis allows them to encode complementary
            LID-specific contents in the speech. The outputs of these two
            embedding extractors are combined together using a self-attention
            mechanism to get the final utterance-level embedding (u-vector).
            This u-vector is then processed by the language classifier to
            identify the language.
          </p>
        </div>
        <br />
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
            {/* <li
              key="Spoken language identification in unseen target domain using within-sample similarity loss."
              className="list-group-item"
            >
              &nbsp;&nbsp;&nbsp;
              <a href=" ">
                <i className="fa-solid fa-file-lines"></i>
                &nbsp;&nbsp; Spoken language identification in unseen target
                domain using within-sample similarity loss
              </a>
            </li> */}
          </ul>
        </div>
      </div>
    </section>
  );
};
