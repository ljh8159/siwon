import base64

def get_model_data():
    with open('model.b64', 'rb') as f:
        return f.read() 