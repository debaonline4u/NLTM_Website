import os
import librosa
from IPython.display import Audio
import subprocess
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import os
import shutil
import json
import numpy as np
import pandas as pd
import glob
import random
from torch.autograd import Variable
from torch.autograd import Function
from torch import optim
import sklearn.metrics
from flask import Flask, jsonify, request, redirect, send_file
from flask_cors import CORS, cross_origin
from flask import send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="/")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# route to home page


@app.route('/')
def index():
    return app.send_static_file("index.html")


@app.route('/static')
def send_report():
    return send_from_directory('static')  # , 'index.html')


# route for health checkup of backend service
@app.route('/health')
def health():
    resp = {"status": "HEALTHY", "code": "200"}
    return jsonify(resp)


# creating Application Config to save the audio files [ Place the path according to your OS / Storage ]
# TODO: in production we need to use the absolute path here
app.config["AUDIO_UPLOADS"] = './unclassified_audio_files'
app.config["AUDIO_UPLOADS_CLASSIFIED"] = './classified_audio_files'
app.config["FEATURE_EXE_PATH"] = './feature_extractor'


############################################
Nc = 8  # Number of language classes
n_epoch = 20  # Number of epochs
IP_dim = 80
e_dim = 64*2

look_back = 30

######################## ML functions for new features / Recorded Audio ######################


def lstm_data(f):

    df = pd.read_csv(f, encoding='utf-16', usecols=list(range(0, IP_dim)))
    dt = df.astype(np.float32)
    X = np.array(dt)

    Xdata1 = []

    mu = X.mean(axis=0)
    std = X.std(axis=0)
    np.place(std, std == 0, 1)
    X = (X - mu) / std

    for i in range(0, len(X)-look_back, 1):  # High resolution low context
        a = X[i:(i+look_back), :]
        Xdata1.append(a)
    Xdata1 = np.array(Xdata1)
    Xdata1 = torch.from_numpy(Xdata1).float()

    return Xdata1, 1, 1

#################################################################################


class LSTMNet(torch.nn.Module):
    def __init__(self):
        super(LSTMNet, self).__init__()
        self.lstm1 = nn.LSTM(IP_dim, 256, bidirectional=True)
        self.lstm2 = nn.LSTM(2*256, 64, bidirectional=True)

        self.fc_ha = nn.Linear(e_dim, 128)
        self.fc_1 = nn.Linear(128, 1)
        self.sftmax = torch.nn.Softmax(dim=1)

        self.Lang_classifier = nn.Linear(e_dim, Nc)  # O/p Layer

    def forward(self, x):
        x, _ = self.lstm1(x)
        x, _ = self.lstm2(x)

        ht = x[-1]
        ht = torch.unsqueeze(ht, 0)
        ha = torch.tanh(self.fc_ha(ht))
        alpha = self.fc_1(ha)
        al = self.sftmax(alpha)  # Attention vector

        T = list(ht.shape)[1]  # T=time index
        batch_size = list(ht.shape)[0]
        dim = list(ht.shape)[2]
        c = torch.bmm(al.view(batch_size, 1, T), ht.view(batch_size, T, dim))
        #print('c size',c.size())
        u_vec = torch.squeeze(c, 0)

        # Langue prediction from language classifier
        lang_output = self.Lang_classifier(u_vec)

        return lang_output

##########################################################


def classify(file_path):
    id2lang = {0: "Assamese", 1: "Bengali", 2: "Gujrati", 3: "Hindi",
               4: "Kannada", 5: "Malayalam", 6: "Odia", 7: "Telugu"}
    model = LSTMNet()
    model_path = "./model/base1_e3.pth"
    model.load_state_dict(torch.load(model_path, map_location='cpu'))

    X1, Y, True_Lng = lstm_data(file_path)
    X1 = np.swapaxes(X1, 0, 1)
    X1 = Variable(X1, requires_grad=True)

    output = model.forward(X1)
    P = output.argmax()
    P = np.array([P.numpy()])[0]
    print({'actual': True_Lng, 'predicted': id2lang[P]})
    return {'actual': True_Lng, 'predicted': id2lang[P]}

############################################################


############ ML functions for Original Features ################

###############################################
def og_lstm_data(f):
    f1 = os.path.splitext(f)[0]
    lang = f1[0:3]
    df = pd.read_csv("./sample_audio_files/sample_BNF/"+f1 +
                     ".csv", encoding='utf-16', usecols=list(range(0, IP_dim)))
    dt = df.astype(np.float32)
    X = np.array(dt)

    Xdata1 = []

    mu = X.mean(axis=0)
    std = X.std(axis=0)
    np.place(std, std == 0, 1)
    X = (X - mu) / std
#    f1 = os.path.splitext(f)[0]
#    print(f1)
#    lang = f1[42:45]

    lab2id = {'asm': 0, 'ben': 1, 'guj': 2, 'hin': 3,
              'kan': 4, 'mal': 5, 'odi': 6, 'tel': 7}
    lab2lang = {'asm': "Assamese", 'ben': "Bengali", 'guj': "Gujrati", 'hin': "Hindi",
                'kan': "Kannada", 'mal': "Malayalam", 'odi': "Odia", 'tel': "Telugu"}

    Y1 = np.array(lab2id[lang])
    Lng = lab2lang[lang]

    for i in range(0, len(X)-look_back, 1):  # High resolution low context
        a = X[i:(i+look_back), :]
        Xdata1.append(a)
    Xdata1 = np.array(Xdata1)
    Xdata1 = torch.from_numpy(Xdata1).float()
    return Xdata1, Y1, Lng


def og_classify(file_path):
    id2lang = {0: "Assamese", 1: "Bengali", 2: "Gujrati", 3: "Hindi",
               4: "Kannada", 5: "Malayalam", 6: "Odia", 7: "Telugu"}
    model = LSTMNet()
    model_path = "./model/base1_e3.pth"
    model.load_state_dict(torch.load(model_path, map_location='cpu'))

    X1, Y, True_Lng = og_lstm_data(file_path)
    X1 = np.swapaxes(X1, 0, 1)
    X1 = Variable(X1, requires_grad=True)

    output = model.forward(X1)
    P = output.argmax()
    P = np.array([P.numpy()])[0]
    print({'actual': True_Lng, 'predicted': id2lang[P]})
    return {'actual': True_Lng, 'predicted': id2lang[P]}

######################################################################


# function to save the predictio results
def save_prediction_results(audio_file_name, pred_lang):

    with open('./prediction_results/prediction_res.json') as pres:
        pres_data = json.load(pres)

    pres_data["rec_files"][audio_file_name] = {"predicted_lang": pred_lang}

    with open('./prediction_results/prediction_res.json', "w") as f:
        json.dump(pres_data, f, indent=4)

    print("Prediction Results Saved Successfully.....")


# route to update the user feedback on audio prediction
@app.route('/feedbackupdate/', methods=['POST'])
def feedbackUpdate():

    user_feed_back = request.get_json()
    file_name = user_feed_back["audiofilename"]
    actual_lang = user_feed_back["actual_lang"]

    # based on user feedback updating the prediction results
    with open('./prediction_results/prediction_res.json') as pres:
        pres_data = json.load(pres)

    pres_data["rec_files"][file_name]["actual_lang"] = actual_lang

    with open('./prediction_results/prediction_res.json', "w") as f:
        json.dump(pres_data, f, indent=4)

    # moving audio file from unclassified folder to classified folder in appropriate location [ according to acutal language ]
    shutil.move(app.config["AUDIO_UPLOADS"]+'/'+file_name,
                app.config["AUDIO_UPLOADS_CLASSIFIED"]+'/'+actual_lang+'/'+file_name)

    return jsonify({"status": "ACCEPTABLE", "msg": "FEEDBACK UPDATED"})


# route to receive the audio file from front end
@app.route('/audiorecv', methods=['POST'])
def upload_audio_file():
    if request.method == 'POST':

        if request.files:
            audio = request.files['audio']

            # saving the audio file
            audio.save(os.path.join(
                app.config["AUDIO_UPLOADS"], audio.filename))

            # re-sampling the audio file as 8kHz raw data
            data1, sample_rate = librosa.load(
                app.config["AUDIO_UPLOADS"]+'/'+audio.filename, sr=8000)

            # converting the raw data to the .wav file
            re_sampled_audio = Audio(data=data1, rate=sample_rate)
            print(sample_rate)

            # saving the re-sampled file again [ this makes it ready for feature extraction ]
            with open(app.config["AUDIO_UPLOADS"]+'/'+audio.filename, 'wb') as f:
                f.write(re_sampled_audio.data)
            with open(app.config["FEATURE_EXE_PATH"]+'/'+'example.wav', 'wb') as f:
                f.write(re_sampled_audio.data)

            # Running the Feature extraction code to genearte the features [ .csv file ]
            print('[Extracting Features and Creating .csv file.....')
            path_feature_exe = app.config["FEATURE_EXE_PATH"] + \
                '/mkhaudio2bottleneck.py'
            path_audio = app.config["FEATURE_EXE_PATH"]+'/example.wav'
            path_save = app.config["FEATURE_EXE_PATH"]+'/test123'
            cmd = 'python3 '+path_feature_exe+' BabelMulti '+path_audio+' '+path_save
            print(cmd)
            p = subprocess.Popen(cmd, shell=True)
            out, err = p.communicate()

            # Running the ML model to predict the language
            ml_output = classify('./feature_extractor/test123.csv')
            pred_lang = ml_output['predicted']

            # Saving the prediction results [ one more end point to get user feedback on prediction ]
            save_prediction_results(audio.filename, pred_lang)

            return jsonify({"status": "ACCEPTABLE", "msg": "AUDIO SAVED", "predicted_lang": pred_lang})

    return jsonify({"status": "NOT ACCEPTABLE", "msg": "POST EXPECTED"})


# route for the original functionality of the web site
@app.route('/ogdemo', methods=['POST'])
def demo():
    if request.method == 'POST':
        file_name_payload = request.get_json()
        file_name = file_name_payload["audiofilename"]
        output = og_classify(file_name)
        return jsonify(output)
    return jsonify({"status": "404", "msg": "ERROR : Audio Files Not Found, POST method expected"})


# route for getting the audio file from backend to the front-end
@app.route('/ogdemo-getfile/<f>', methods=['GET'])
def demoGetFile(f):
    if request.method == 'GET':
        f1 = os.path.splitext(f)[0]
        lang = f1[0:3]
        return send_file("./sample_audio_files/sample_wav/"+lang+"/"+f1 + ".wav", mimetype="audio/wav", as_attachment=True, download_name=f1)
    return jsonify({"status": "404", "msg": "ERROR : Audio Files Not Found, POST method expected"})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
