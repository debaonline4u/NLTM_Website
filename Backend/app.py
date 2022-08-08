import os
import librosa
from IPython.display import Audio
import subprocess

from flask import Flask, jsonify, request, redirect
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# route for health checkup of backend service
@app.route('/health')
def health():
    resp = {"status": "HEALTHY", "code": "200"}
    return jsonify(resp)


# route to home page
@app.route('/')
def home():
    return "home page"

# creating Application Config to save the audio files [ Place the path according to your OS / Storage ]
# TODO: in production we need to use the absolute path here
app.config["AUDIO_UPLOADS"] = './audio_files'
app.config["FEATURE_EXE_PATH"] = './feature_extractor'


# route to receive the audio file from front end
@app.route('/audiorecv', methods=['POST'])
def upload_audio_file():
    if request.method == 'POST':

        if request.files:
            audio = request.files['audio']

            # saving the audio file
            audio.save(os.path.join(app.config["AUDIO_UPLOADS"], audio.filename))

            # re-sampling the audio file as 8kHz raw data
            data1, sample_rate = librosa.load(app.config["AUDIO_UPLOADS"]+'/'+audio.filename,sr=8000)

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
            path_feature_exe = app.config["FEATURE_EXE_PATH"]+'/mkhaudio2bottleneck.py'
            path_audio = app.config["FEATURE_EXE_PATH"]+'/example.wav'
            path_save = app.config["FEATURE_EXE_PATH"]+'/test123'
            cmd = 'python3 '+path_feature_exe+' BabelMulti '+path_audio+' '+path_save
            print(cmd)
            p = subprocess.Popen(cmd, shell=True)
            out, err = p.communicate()

            return jsonify({"status": "ACCEPTABLE", "msg": "AUDIO SAVED"})

    return jsonify({"status": "NOT ACCEPTABLE", "msg": "POST EXPECTED"})


if __name__ == '__main__':
    app.run(debug=True)



# # Cross channel testing of LowResource LID model

# #######################
# import torch

# import torch.nn as nn
# import torch.nn.functional as F
# import torchvision.transforms as transforms

# import os 
# import numpy as np
# import pandas as pd

# import glob
# import random

# from torch.autograd import Variable
# from torch.autograd import Function
# from torch import optim

# import sklearn.metrics

# ############################################
# Nc = 8 # Number of language classes 
# n_epoch = 20 # Number of epochs
# IP_dim = 80
# e_dim = 64*2

# look_back = 30 

# ###############################################
# def lstm_data(f):

#     df = pd.read_csv(f, encoding='utf-16', usecols=list(range(0,IP_dim)))
#     dt = df.astype(np.float32)
#     X=np.array(dt)
    
#     Xdata1=[]
      
#     mu = X.mean(axis=0)
#     std = X.std(axis=0)
#     np.place(std, std == 0, 1) 
#     X = (X - mu) / std 
#     f1 = os.path.splitext(f)[0]     
# #    print(f1)
#     # lang = f1[42:45]

#     lab2id = {'asm':0, 'ben':1, 'guj':2, 'hin':3, 'kan':4, 'mal':5, 'odi':6, 'tel':7}
#     lab2lang = {'asm':"Assamese", 'ben':"Bengali", 'guj':"Gujrati", 'hin':"Hindi", 'kan':"Kannada", 'mal':"Malayalam", 'odi':"Odia", 'tel':"Telugu"}
    
#     # Y1 = np.array(lab2id[lang])
#     # Lng = lab2lang[lang]
    
    
#     for i in range(0,len(X)-look_back,1):    #High resolution low context        
#         a=X[i:(i+look_back),:]        
#         Xdata1.append(a)
#     Xdata1 = np.array(Xdata1)
#     Xdata1 = torch.from_numpy(Xdata1).float()    
#     # return Xdata1, Y1, Lng
#     return Xdata1, 0,0

# #################################################################################

# class LSTMNet(torch.nn.Module):
#     def _init_(self):
#         super(LSTMNet, self)._init_()
#         self.lstm1 = nn.LSTM(IP_dim, 256,bidirectional=True)
#         self.lstm2 = nn.LSTM(2*256, 64,bidirectional=True)
        
#         self.fc_ha=nn.Linear(e_dim,128) 
#         self.fc_1= nn.Linear(128,1)           
#         self.sftmax = torch.nn.Softmax(dim=1)
        
#         self.Lang_classifier = nn.Linear(e_dim, Nc) # O/p Layer
        

#     def forward(self, x):
#         x, _ = self.lstm1(x) 
#         x, _ = self.lstm2(x)

#         ht = x[-1]
#         ht = torch.unsqueeze(ht, 0)      
#         ha = torch.tanh(self.fc_ha(ht))
#         alpha = self.fc_1(ha)
#         al = self.sftmax(alpha) # Attention vector
        
#         T = list(ht.shape)[1]  #T=time index
#         batch_size = list(ht.shape)[0]
#         dim = list(ht.shape)[2]
#         c = torch.bmm(al.view(batch_size, 1, T),ht.view(batch_size,T,dim))
#         #print('c size',c.size())        
#         u_vec = torch.squeeze(c,0)
        
#         lang_output = self.Lang_classifier(u_vec) # Langue prediction from language classifier
        
#         return lang_output

# ##########################################################   

 
# def classify(file_path):
#     id2lang = {0:"Assamese", 1:"Bengali", 2:"Gujrati", 3:"Hindi", 4:"Kannada", 5:"Malayalam", 6:"Odia", 7:"Telugu"}
#     model = LSTMNet()
#     model_path = "./model/base1_e3.pth"
#     model.load_state_dict(torch.load(model_path, map_location='cpu'))

#     X1, Y, True_Lng = lstm_data(file_path)
#     X1 = np.swapaxes(X1,0,1)
#     X1 = Variable(X1, requires_grad=True)

#     output = model.forward(X1)
#     P = output.argmax()
#     P = np.array([P.numpy()])[0]
#     print({'actual': True_Lng, 'predicted': id2lang[P]})
#     return {'actual': True_Lng, 'predicted': id2lang[P]}


# print(classify('./odi123.csv'))