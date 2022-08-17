<div id="top"></div>
<div align="center">
<h3 align="center"> NLTM-LID - IIT Mandi and NIT GOA </h3>
  <p align="center">
    Spoken Language Identification <br />
    Spoken language identification system from the conversational speech of Indian languages and Indian English.
    <br /><br />
    <strong>
    <a href="https://debaonline4u.github.io/NLTM_Website/">View Deployment</a>
    </strong>
  </p>
</div>

## 🤔TODO

-

<!-- ABOUT THE PROJECT -->

## 📝About The Project

![Screenshot](https://raw.githubusercontent.com/debaonline4u/NLTM_Website/main/img/screenshot-home.jpg)
<br /> <br />
This is a Deep Neural Network (DNN) based Language Identification system designed to identify 8 Indian languages. This model can identify Assamase, Bengali, Gujrati, Hindi, Kannada, Malayalam, Odia and Telugu. Some details about these languages can be found here. Here, we use a bidirectional long short-term memory (BLSTM) based DNN model. In this system, the input speech is first converted into a sequence of bottelneck features (BNFs). The BLSTM layers in the DNN then analyse this sequence of BNFs by dividing it into fixed-length chunks (each chunk ~600 ms) to produce LID-seq-senones. Each LID-seq-senone is a compact representation of the given fixed-lingth chunk. These LID-seq-senones are then processed by a self-attention block, which assigns a weightage to each of these LID-seq-senones based on their relevance to the LID task. Using these attention values, weighted average of these LID-seq-senones are then computed to obtain an utterance-level representation of the speech (called u-vector). This u-vector is then processed by the output layer to identify the language.

<p align="right">(<a href="#top">⬆️</a>)</p>

### 🛠Built With

-   🌐 &nbsp; Frontend </br>
    ![HTML5](https://img.shields.io/badge/-HTML5-333333?style=flat&logo=HTML5)
    ![CSS](https://img.shields.io/badge/-CSS-333333?style=flat&logo=CSS3&logoColor=1572B6)
    ![JAVASCRIPT](https://img.shields.io/badge/-JS-333333?style=flat&logo=javascript)
    ![REACT](https://img.shields.io/badge/-React-333333?style=flat&logo=React)
    ![React-Router](https://img.shields.io/badge/-React%20Router-333333?style=flat&logo=react-router)
    ![MSR](https://img.shields.io/badge/-MSR-333333?style=flat&logo=microphone)
-   🧾&nbsp; Backend </br>
    ![Python 3](https://img.shields.io/badge/-Python-333333?style=flat&logo=Python)
    ![PyTorch](https://img.shields.io/badge/-PyTorch-333333?style=flat&logo=pytorch)
    ![Flask](https://img.shields.io/badge/-Flask-333333?style=flat&logo=flask)
    ![NumPy](https://img.shields.io/badge/-NumPy-333333?style=flat&logo=numpy)
    ![Pandas](https://img.shields.io/badge/-Pandas-333333?style=flat&logo=pandas)
    ![Librosa](https://img.shields.io/badge/-Librosa-333333?style=flat)

<p align="right">(<a href="#top">⬆️</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

You can just visit the [NLTM-Website](https://debaonline4u.github.io/NLTM_Website/) page for using this app.

### Prerequisites

There is no such complicated prerequisites for using this app except for `using modern browsers`. But if you are using it locally you will need `python3` and you will have to install some python packages.

### ⚙Installation

If you want to get a local copy of this app.

1. Clone the repo
    ```sh
    git clone https://github.com/debaonline4u/NLTM_Website.git
    ```
2. Navigate to the folder `NLTM_Website`
    ```sh
    cd NLTM_Website
    ```
3. Run the server file 

    ```sh
    # For serving the localhost
    python server.py  # for Windows
    python3 server.py   # for Linux and Mac

    # For serving and opening the file in the browser provided (by default firefox)
    python server.py --open=firefox  # for Windows
    python3 server.py --open=firefox  # for Linux and Mac
    ```

<p align="right">(<a href="#top">⬆️</a>)</p>

<!-- CONTRIBUTING -->

## 🤝Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this app better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">⬆️</a>)</p>


<!-- CONTACT -->

## Contact

Twitter - todo <br>
LinkedIn - todo <br>
Project Link: todo

<p align="right">(<a href="#top">⬆️</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

-   Thanks todo

<p align="right">(<a href="#top">⬆️</a>)</p>
