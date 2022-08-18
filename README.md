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

- edit readme file
- change the about text
- add predefined audio support

<!-- ABOUT THE PROJECT -->

## 📝About The Project

![Screenshot](https://raw.githubusercontent.com/debaonline4u/NLTM_Website/main/img/screenshot-home.jpg)
<br /> <br />
This is a Deep Neural Network (DNN) based Language Identification system designed to identify 8 Indian languages. This model can identify  `Assamase`, `Bengali`, `Gujrati`, `Hindi`, `Kannada`, `Malayalam`, `Odia` and `Telugu`. <br/>

Here, we use a bidirectional long short-term memory (BLSTM) based DNN model. In this system, the input speech is first converted into a sequence of bottelneck features (BNFs). The BLSTM layers in the DNN then analyse this sequence of BNFs by dividing it into fixed-length chunks (each chunk ~600 ms) to produce LID-seq-senones. <br/>

Each LID-seq-senone is a compact representation of the given fixed-lingth chunk. These LID-seq-senones are then processed by a self-attention block, which assigns a weightage to each of these LID-seq-senones based on their relevance to the LID task. Using these attention values, weighted average of these LID-seq-senones are then computed to obtain an utterance-level representation of the speech (called u-vector). This u-vector is then processed by the output layer to identify the language.

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

There is no such complicated prerequisites for using this app except for `using modern browsers`. But if you are using it locally you will need `python3` and `nodejs>=16.0` and you will have to install some packages.

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
3. To host the Backend, we need to install some packages via `pip`. Hence, run the following command. (Note: use `Python 3` only)

    ```sh
    # Installing backend dependencies
    pip install numpy pandas torch librosa ipython sklearn flask flask_cors
    ```
    and then run the following command to start the backend
    ```sh
    # To go into the Backend Folder
    cd Backend/
    # Run the server
    python app.py
    ```
4. To host the Frontend, there are two steps: First `to build the frontend using the url of backend` and then `to serve it using serve package`.<br/>
   We need to install some packages via `npm`. Hence, run the following command in new terminal. (Note: use `node>=16.0` only)

    ```sh
    # Go to the Project directory where package.json is located
    cd <project-dir>
    
    # run the following command to install the packages
    npm install
    ```
    <details>
    <summary> <span style="color:red">Note: You can skip this step if you do not need to modify the backend URL</span></summary>
     <br />
      Find the `.env.local` file and open it in any text editor and replace the line like this:

      ```
      REACT_APP_BACKEND_HOME_URL="paste your url here which you copied in step 3, without quotes"

      # For example -> REACT_APP_BACKEND_HOME_URL=http://localhost:5000
      ```


      after you have update the link, we need to build the Frontend. Hence, run the following command in terminal.



      ```sh
      # Go to the Project directory where package.json is located
      cd <project-dir>

      # command to build the frontend
      npm run build
      ```
      this will populate the `docs\` folder with the new build files, making it ready to serve. 

    </details>
    
5.  Serve with the following command.
     ```sh
    # serve the pages on port 3000(default)
    npx serve -s docs
    
    # run this, if you want to run it on different port instead
    # the port can be adjusted using the -l or --listen flag
    serve -s build -l <your-port-number-here>
    ```
    for more details on `serve` package [see this page](https://create-react-app.dev/docs/deployment/).
    <br />
6. The site is hosted now on specified port.
    
<p align="right">(<a href="#top">⬆️</a>)</p>

<!-- CONTACT -->

## Contact

Twitter - todo 
<br>
LinkedIn - todo
<br>
Project Link: todo

<p align="right">(<a href="#top">⬆️</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

-   TODO

<p align="right">(<a href="#top">⬆️</a>)</p>
