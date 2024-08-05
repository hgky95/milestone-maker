from flask import Flask
from flask_restful import Api
from flask_cors import CORS


from AIIntegration import AIIntegration

app = Flask(__name__)
# Allow CORS for all domains at this time
CORS(app)
api = Api(app)

api.add_resource(AIIntegration, '/ai/generate')

if __name__ == '__main__':
    app.run(port=5001, debug=True)
    # app.run(host='0.0.0.0', port=5001, debug=True)
