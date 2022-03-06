from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import DataRetrival
import json

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))

app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# @app.route('/', methods=['GET', 'POST'])
# def index(): 
#     return render_template('index.html')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/searchWord', methods=['POST'])
@cross_origin()
def searchWord(): 
    if request.method == 'POST':
        posted_data = request.get_json()
        # print(posted_data)
        words = posted_data['searchInput']        #Fetch the data from request payload
        allColumnsDict = DataRetrival.getData()  # All columns dict retrival from DataRetrival.py
        allData = list()
        
        for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'description':[]}
            if words.lower() in title.lower() or words.lower() in allColumnsDict[title][0].lower() or words.lower() in allColumnsDict[title][1].lower():
                title1 = title.replace('Â', '').replace('\xa0', ' ')
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ')
                urlDescDict['title'] = title1
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['description'] = desc
                allData.append(urlDescDict)
        # print(allData)
        return jsonify({'result': allData})

if __name__ == '__main__':
   app.run(debug=True)
