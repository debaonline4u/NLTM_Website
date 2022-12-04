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

app = Flask(__name__, static_folder="static", static_url_path="/")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# route to home page


@app.route('/')
def index():
    return "Backend is working!"


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
# old Params
# Nc = 8  # Number of language classes
# n_epoch = 20  # Number of epochs
# IP_dim = 80
# e_dim = 64*2
# look_back = 30


# New Params
e_dim = 128*2
Nc = 12 # Number of language classes 
IP_dim = 80 # number of input dimension
look_back1 = 20 
look_back2 = 50

######################## ML functions for new features / Recorded Audio ######################


def lstm_data_old(f):

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


def lstm_data(f):
    df = pd.read_csv(f, encoding='utf-16', usecols=list(range(0,80)))
    dt = df.astype(np.float32)
    X = np.array(dt)
    
    Xdata1=[]
    Xdata2=[] 
      
    mu = X.mean(axis=0)
    std = X.std(axis=0)
    np.place(std, std == 0, 1)
    X = (X - mu) / std 
    f1 = os.path.splitext(f)[0]     
    
    for i in range(0,len(X)-look_back1,1):    #High resolution low context        
        a=X[i:(i+look_back1),:]        
        Xdata1.append(a)
    Xdata1=np.array(Xdata1)

    for i in range(0,len(X)-look_back2,2):     #Low resolution long context       
        b=X[i+1:(i+look_back2):3,:]        
        Xdata2.append(b)
    Xdata2=np.array(Xdata2)
    
    Xdata1 = torch.from_numpy(Xdata1).float()
    Xdata2 = torch.from_numpy(Xdata2).float()
    
    return Xdata1,Xdata2
#################################################################################


class LSTMNet_old(torch.nn.Module):
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

class LSTMNet(torch.nn.Module):
    def __init__(self):
        super(LSTMNet, self).__init__()
        self.lstm1 = nn.LSTM(80, 350, bidirectional=True)
        self.lstm2 = nn.LSTM(2*350, 128, bidirectional=True)
        #self.linear = nn.Linear(2*64,e_dim)
               
        self.fc_ha=nn.Linear(e_dim, 100) 
        self.fc_1= nn.Linear(100, 1)           
        self.sftmax = torch.nn.Softmax(dim=1)

    def forward(self, x):
        x1, _ = self.lstm1(x) 
        x2, _ = self.lstm2(x1)
        ht = x2[-1]
        ht = torch.unsqueeze(ht, 0) 
        #ht = torch.tanh(self.linear(ht))      
        ha = torch.tanh(self.fc_ha(ht))
        alp = self.fc_1(ha)
        al = self.sftmax(alp) 
        
       
        T = list(ht.shape)[1]  
        batch_size = list(ht.shape)[0]
        D = list(ht.shape)[2]
        c = torch.bmm(al.view(batch_size, 1, T),ht.view(batch_size,T,D))        
        c = torch.squeeze(c,0)        
        return (c)


class CCSL_Net(nn.Module):
    def __init__(self, model1,model2):
        super(CCSL_Net, self).__init__()
        self.model1 = model1
        self.model2 = model2
        
        self.att_fc = nn.Linear(e_dim,e_dim)
        #self.cla_fc = nn.Linear(e_dim,e_dim)
        
        self.sftmx = torch.nn.Softmax(dim=1)

        self.lang_classifier = nn.Linear(e_dim, Nc, bias = True)
        self.adv_classifier = nn.Linear(e_dim, Nc, bias = True) 
        
        
    def attention(self, att, cla):

        epsilon = 1e-7
        att = torch.clamp(att, epsilon, 1. - epsilon)
        norm_att = att / torch.sum(att, dim=1)[:, None, :]

        u_LID = torch.sum(norm_att * cla, dim=1)  # Disentagle LID-specific and channel-specific u-vectors
        u_ch = torch.sum(1-norm_att * cla, dim=1)
        
        return u_LID, u_ch   
        
        
    def forward(self, x1,x2):
        e1 = self.model1(x1)
        e2 = self.model2(x2) 
        
        att_input = torch.cat((e1,e2), dim=0)
        att_input = torch.unsqueeze(att_input, 0)
        
        att = torch.sigmoid(self.att_fc(att_input))
        cla = att_input # No additional layer 
        u_lid, u_ch = self.attention(att, cla) # Get LID-specific and channel-specific u-vectors.
        
        lang_output = self.lang_classifier(u_lid)      # Restitute the u_lid  
        lang_output = self.sftmx(lang_output) # Langue prediction from language classifier
        
        return lang_output

##########################################################


def classify_old(file_path):
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


def classify(file_path):
    id2lang = {0: "Assamese", 1: "Bengali", 2: "English", 3: "Gujrati", 
                4: "Hindi", 5: "Kannada", 6: "Malayalam", 7: "Marathi", 
                8: "Odia", 9: "Punjabi", 10: "Tamil", 11: "Telugu"}

    model1 = LSTMNet()
    model2 = LSTMNet()
    model = CCSL_Net(model1, model2)

    model_path = './model/den_base_e48_31_oct.pth'
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))

    X1, X2 = lstm_data(file_path)

    X1 = np.swapaxes(X1,0,1)
    X2 = np.swapaxes(X2,0,1)
    x1 = Variable(X1, requires_grad=False)
    x2 = Variable(X2, requires_grad=False)
    output = model.forward(x1, x2)

    pred_all = output.detach().cpu().numpy()[0]  # all probability scores
    Pred = np.argmax(output.detach().cpu().numpy(), axis=1)[0]    
    True_Lng = 1

    print({'actual': True_Lng, 'predicted': id2lang[Pred]})
    print('All Prob Values: ', pred_all)
    return {'actual': True_Lng, 'predicted': id2lang[Pred]} #pred_all not used now
############################################################


############ ML functions for Original Features ################

###############################################
def og_lstm_data_old(f):
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

    # lab2id = {'asm': 0, 'ben': 1, 'guj': 2, 'hin': 3,
    #           'kan': 4, 'mal': 5, 'odi': 6, 'tel': 7}
    lab2id = {'asm': 0, 'ben':1, 'eng':2, 'guj':3, 'hin':4, 'kan':5, 
                'mal':6, 'mar':7, 'odi':8, 'pun':9, 'tam':10, 'tel':11}
    lab2lang = {'asm': "Assamese", 'ben': "Bengali", 'eng': "English",
                'guj': "Gujrati", 'hin': "Hindi", 'kan': "Kannada", 
                'mal': "Malayalam", 'mar': "Marathi", 'odi': "Odia", 
                 'pun': "Punjabi" , 'tam': "Tamil", 'tel': "Telugu"}

    Y1 = np.array(lab2id[lang])
    Lng = lab2lang[lang]

    for i in range(0, len(X)-look_back, 1):  # High resolution low context
        a = X[i:(i+look_back), :]
        Xdata1.append(a)
    Xdata1 = np.array(Xdata1)
    Xdata1 = torch.from_numpy(Xdata1).float()
    return Xdata1, Y1, Lng


def og_lstm_data(f):
    f1 = os.path.splitext(f)[0]
    lang = f1[0:3]
    df = pd.read_csv("./sample_audio_files/sample_BNF/"+f1 +
                     ".csv", encoding='utf-16', usecols=list(range(0, IP_dim)))
    dt = df.astype(np.float32)
    X = np.array(dt)

    Xdata1, Xdata2 = [], []


    mu = X.mean(axis=0)
    std = X.std(axis=0)
    np.place(std, std == 0, 1)
    X = (X - mu) / std
#    f1 = os.path.splitext(f)[0]
#    print(f1)
#    lang = f1[42:45]

    # lab2id = {'asm': 0, 'ben': 1, 'guj': 2, 'hin': 3,
    #           'kan': 4, 'mal': 5, 'odi': 6, 'tel': 7}
    lab2id = {'asm': 0, 'ben':1, 'eng':2, 'guj':3, 'hin':4, 'kan':5, 
                'mal':6, 'mar':7, 'odi':8, 'pun':9, 'tam':10, 'tel':11}
    lab2lang = {'asm': "Assamese", 'ben': "Bengali", 'eng': "English",
                'guj': "Gujrati", 'hin': "Hindi", 'kan': "Kannada", 
                'mal': "Malayalam", 'mar': "Marathi", 'odi': "Odia", 
                 'pun': "Punjabi" , 'tam': "Tamil", 'tel': "Telugu"}

    Y1 = np.array(lab2id[lang])
    Lng = lab2lang[lang]

    # for i in range(0, len(X)-look_back, 1):  # High resolution low context
    #     a = X[i:(i+look_back), :]
    #     Xdata1.append(a)
    # Xdata1 = np.array(Xdata1)
    # Xdata1 = torch.from_numpy(Xdata1).float()

    for i in range(0,len(X)-look_back1,1):    #High resolution low context        
        a=X[i:(i+look_back1),:]        
        Xdata1.append(a)
    Xdata1=np.array(Xdata1)

    for i in range(0,len(X)-look_back2,2):     #Low resolution long context       
        b=X[i+1:(i+look_back2):3,:]        
        Xdata2.append(b)
    Xdata2=np.array(Xdata2)

    Xdata1 = torch.from_numpy(Xdata1).float()
    Xdata2 = torch.from_numpy(Xdata2).float()

    return Xdata1, Xdata2, Y1, Lng



def og_classify(file_path):
    # id2lang = {0: "Assamese", 1: "Bengali", 2: "Gujrati", 3: "Hindi",
    #            4: "Kannada", 5: "Malayalam", 6: "Odia", 7: "Telugu"}

    id2lang = {0: "Assamese", 1: "Bengali", 2: "English", 3: "Gujrati", 
                4: "Hindi", 5: "Kannada", 6: "Malayalam", 7: "Marathi", 
                8: "Odia", 9: "Punjabi", 10: "Tamil", 11: "Telugu"}

    # model = LSTMNet()   # this is old model

    model1 = LSTMNet()
    model2 = LSTMNet()

    model = CCSL_Net(model1, model2)

    model_path = "./model/den_base_e48_31_oct.pth"
    model.load_state_dict(torch.load(model_path, map_location='cpu'))

    X1, X2, Y, True_Lng = og_lstm_data(file_path)
    X1 = np.swapaxes(X1, 0, 1)
    X1 = Variable(X1, requires_grad=True)

    X2 = np.swapaxes(X2,0,1)
    X2 = Variable(X2, requires_grad=False)

    output = model.forward(X1, X2)

    # P = output.argmax()
    # P = np.array([P.numpy()])[0]

    pred_all = output.detach().cpu().numpy()[0]  # Prob. for all languages
    Pred = np.argmax(output.detach().cpu().numpy(), axis=1)[0]

    print({'actual': True_Lng, 'predicted': id2lang[Pred]})
    return {'actual': True_Lng, 'predicted': id2lang[Pred]}

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
    context = ('/var/www/html/nltm-lid/NLTM_Website-main/Backend/ssl/SSL.crt', '/var/www/html/nltm-lid/NLTM_Website-main/Backend/ssl/SSL.key')
    app.run(host='0.0.0.0', debug=True, port=5001 ,  ssl_context=context)
    # app.run(host='research.iitmandi.ac.in', debug=True, port=5001 ,  ssl_context=context)
    # app.run(debug=True, port=5000)
