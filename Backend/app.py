import os

from flask import Flask, jsonify, request, redirect

app = Flask(__name__)


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
app.config["AUDIO_UPLOADS"] = './audio_files'


# route to receive the audio file from front end
@app.route('/audiorecv', methods=['POST'])
def upload_audio_file():
    if request.method == 'POST':

        if request.files:
            audio = request.files['audio']

            audio.save(os.path.join(app.config["AUDIO_UPLOADS"], audio.filename))

            return jsonify({"status": "ACCEPTABLE", "msg": "AUDIO SAVED"})

    return jsonify({"status": "NOT ACCEPTABLE", "msg": "POST EXPECTED"})


if __name__ == '__main__':
    app.run(debug=True)
