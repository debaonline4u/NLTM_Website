export const Features = () => {
    return (
        <div
            id="features"
            className="text-center"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11pt",
                maxWidth: "1200px",
            }}
        >
            <div className="container">
                <div
                    className="col-md-10 col-md-offset-1 section-title"
                    style={{ marginBottom: "0px" }}
                >
                    <h2>Features</h2>
                </div>
            </div>
            <div className="text text-left">
                <>
                    <p>
                        India exhibits unity in diversity not only in culture
                        and religion but also in languages spoken by people.
                        Language plays a vital role in communication among
                        people as well as in accessing information and building
                        an inclusive society. India is home to 22
                        constitutionally recognized languages. However, there
                        exist more than 1000 spoken languages in India. In this
                        information era, it is important to ensure that a spoken
                        language gets due representation in digital space. In
                        this regard, enabling the cyber physical systems to
                        understand and interact with people using the spoken
                        Indian languages is very important. This avoids people
                        to opt for a second language such as English to interact
                        with the cyber physical systems. This will further
                        contribute to the success of the prestigious digital
                        India Programme of the Government of India as one of the
                        limitations faced in this arena is the need for
                        interacting with these systems in English. This requires
                        building systems that can analyse the spoken Indian
                        language.
                    </p>
                    <br />
                    <p>
                        The focus of this work is on spoken language
                        identification. The task of spoken language
                        identification (LID) involves automatically identifying
                        the language in which a given speech utterance was
                        spoken. An important aspect of a spoken language is its
                        dialects. Dialects of a given language are differences
                        in speaking style of the first language or native
                        language (L1) because of geographical and ethnic
                        differences.
                    </p>
                    <br />
                    <p>
                        The three important objectives of this work are as
                        follows:
                    </p>
                    <ul className="list-group">
                        <li key="1" className="list-group-item">
                            <i className="fa-solid fa-circle"></i>
                            &nbsp;&nbsp;&nbsp; Development of Spoken Language
                            Identification (LID) System
                        </li>
                        <li key="2" className="list-group-item">
                            <i className="fa-solid fa-circle"></i>
                            &nbsp;&nbsp;&nbsp; Development of Dialect
                            Identification System
                        </li>
                        <li key="3" className="list-group-item">
                            <i className="fa-solid fa-circle"></i>
                            &nbsp;&nbsp;&nbsp; Development of Language
                            Diarization System
                        </li>
                    </ul>
                    <span key="1">
                        <h3>
                            Development of Spoken Language Identification (LID)
                            System
                        </h3>

                        <p>
                            The task of spoken language identification (LID)
                            involves automatically identifying the language in
                            which a given speech utterance was spoken. LID is
                            very helpful in automatic speech recognition
                            systems, speech translation systems, multi-lingual
                            speech recognition, and in language diarization.
                            Approaches for LID may be classified based on the
                            features used and the methodology considered.
                            Recently, deep neural networks (DNN) and convolution
                            neural networks (CNN) based approaches are becoming
                            popular for LID. In this project, we propose to
                            explore deep learning-based approaches to build LID
                            systems for Indian languages. The LID systems are
                            usually vulnerable to noise and channel mismatch
                            occurring due to the mismatch in the channels (like
                            recording devices, type of encoding, etc.,) used to
                            collect the speech samples. In this project we
                            propose to build LID systems for Indian languages
                            that are robust to noise and channel-mismatch.
                        </p>
                    </span>
                    <span key="2">
                        <h3>Development of Dialect Identification System</h3>

                        <p>
                            Dialect of a speech utterance acts as a virtual
                            geo-tag for the utterance that helps in predicting
                            the geographical location to which a speaker
                            belongs. The dialectal variations of a spoken Indian
                            language are a matter of concern for any automatic
                            processing of speech utterances from that language.
                            The project aims at addressing the issues of
                            identifying the dialect in the conversational speech
                            of the Indian languages. Dialect identification is
                            difficult when compared to LID due to high
                            interclass similarity among the dialects of a
                            language. Very little work is done on dialect
                            identification in Indian languages except Hindi. We
                            also propose to explore deep learning methods for
                            the dialect identification task.
                        </p>
                    </span>
                    <span key="3">
                        <h3>Development of Language Diarization System</h3>

                        <p>
                            A language diarization system involves automatically
                            segment and identify languages in a code-switch
                            conversation involving any one of the Indian
                            languages and English. Code-switch refers to the
                            switching of languages in conversational speech and
                            is a common occurrence among multilingual Indian
                            speakers. Most of the Indians are at least
                            bilingual, one language being their first language
                            or native language (L1) and the other being English.
                            It is very important to identify the language used
                            in a particular part of the conversation for further
                            processing of speech in a cyber physical system such
                            as automatic speech recognition (ASR).
                        </p>
                    </span>
                    <div className="container">
                        <div
                            className="col-md-10 col-md-offset-1 section-title text-center"
                            style={{
                                paddingTop: "40px",
                                marginBottom: "0px",
                            }}
                        >
                            <h2>Funding Agency</h2>
                        </div>
                    </div>

                    <p>
                        This NLTM consortium project is sponsored by the
                        Ministry of Electronics and Information and Technology
                        (MeitY) New Delhi, India. This consortium is lead by
                        Prof. (Dr.) Hema A. Murthy and Prof. (Dr.) S. Umesh of
                        IIT Madras.
                    </p>
                </>
            </div>
        </div>
    );
};
