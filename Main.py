from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import DataRetrival
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

# @app.route('/', methods=['GET', 'POST'])
# def index(): 
#     return render_template('index.html')

@app.route('/searchWord', methods=['POST'])
@cross_origin()
def searchWord(): 
    if request.method == 'POST':
        posted_data = request.get_json()
        # print(posted_data)
        words = posted_data['searchInput']        #Fetch the data from request payload
        allColumnsDict = getData()  # All columns dict retrival from DataRetrival.py
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
    cur.execute("SELECT * FROM cdata")
    fdata = cur.fetchall()
    cur.close()
    res = dict()
    for data in fdata:
        res[data[0]] = [data[1], data[2]]
    return res

@app.route('/autocomplete', methods=['POST'])
def Home():
    if request.method == 'POST':
        res = list()
        words = str(request.form['auto_search_box'].strip())#Fetch the data from auto search box
        words = words.lower()
        keys1 = getData().keys()
        for key in keys1:
            key = key.lower()
            if key.startswith(words):
                res.append(key)
        if res == []:
            res.append('NO KEY..............')
    return render_template('Results.html', data=res)

if __name__ == '__main__':
   app.run(debug=True)
