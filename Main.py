from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json

from flask_mysqldb import MySQL

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Poojitha@123'
app.config['MYSQL_DB'] = 'cyberminer_db'

mysql = MySQL(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/searchWord', methods=['POST'])
@cross_origin()
def searchWord(): 
    if request.method == 'POST':
        posted_data = request.get_json()
        # print(posted_data)
        words = posted_data['searchInput']        # Fetch the data from request payload
        allColumnsDict = getData()                # All columns dict retrival from getData()  
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

def getData():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM cyberminer_db.data")
    fdata = cur.fetchall()
    cur.close()
    res = dict()
    for data in fdata:
        res[data[0]] = [data[1], data[2]]
    return res

@app.route('/autoComplete', methods=['POST'])
@cross_origin()
def loadAutoComplete():
    if request.method == 'POST':
        posted_data = request.get_json()
        # print(posted_data)
        words = posted_data['autoCompleteKey'] 
        allData = list()
        for key in getData().keys():
            if key.lower().startswith(words.lower()):
                key1 = key.replace('Â', '').replace('\xa0', ' ')
                allData.append(key1)
        if allData == []:
            allData.append('NO KEY..............')
    return jsonify({'autoCompleteList': allData})

if __name__ == '__main__':
   app.run(debug=True)
