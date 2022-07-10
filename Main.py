from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json

from flask_mysqldb import MySQL

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
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
                title1 = title.replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
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
                key1 = key.replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                allData.append(key1)
        if allData == []:
            allData.append('')
    return jsonify({'autoCompleteList': allData})

# the keywords are only searched in the description
@app.route('/binarySearch', methods=['POST'])
@cross_origin()
def binarySearch():
    if request.method == 'POST':
        posted_data = request.get_json()
        wordOpers = posted_data['searchInput'].split()
        if wordOpers[1] == 'AND':
            res = searchAnd(wordOpers[0], wordOpers[2])
        elif wordOpers[1] == 'OR':
            res = searchOr(wordOpers[0], wordOpers[2])
        elif wordOpers[1] == 'NOT':
            res = searchNot(wordOpers[0], wordOpers[2])
    return jsonify({'result': res})

# both word1 and word2 are present in desc
def searchAnd(word1, word2):
    allColumnsDict = getData()
    searchedData = list()
    for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'description':[]}
            if (word1.lower() in allColumnsDict[title][1].lower() and word2.lower() in allColumnsDict[title][1].lower()):
                title1 = title.replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                urlDescDict['title'] = title1
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['description'] = desc
                searchedData.append(urlDescDict)
    return searchedData
# either word1 and word2 are present in desc
def searchOr(word1, word2):
    allColumnsDict = getData()
    searchedData = list()
    for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'description':[]}
            if word1.lower() in allColumnsDict[title][1].lower() or word2.lower() in allColumnsDict[title][1].lower():
                title1 = title.replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                urlDescDict['title'] = title1
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['description'] = desc
                searchedData.append(urlDescDict)
    return searchedData
#  word1 but not word2 are present in desc
def searchNot(word1, word2):
    allColumnsDict = getData()
    searchedData = list()
    for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'description':[]}
            if word1.lower() in allColumnsDict[title][1].lower() and ((allColumnsDict[title][1].lower()).find(word2) == -1):
                title1 = title.replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ').replace('ï¿½',' ')
                urlDescDict['title'] = title1
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['description'] = desc
                searchedData.append(urlDescDict)
    return searchedData

def binOper(word1, word2, opr):
    if opr == "AND":
        return searchAnd(word1, word2)
    elif opr == "OR":
        return searchOr(word1, word2)
    elif opr == "NOT":
        return searchNot(word1, word2)

# user is requested for title, url, desc and new row is created
@app.route('/createRecord', methods=['POST'])
@cross_origin()
def addData():
    if request.method == 'POST':
        posted_data = request.get_json()
        newRecord = posted_data['newRecord']        # Fetch the data from request payload
        title = newRecord['title']
        url = newRecord['url']
        desc = newRecord['description']
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO data (title, url, description) VALUES (%s, %s, %s)", (title, url, desc))
        mysql.connection.commit()
        cur.close()
    return jsonify({'result': "successfully created new record"})

#title and new desc as input, new desc is updated for respective title
@app.route('/updateRecord', methods=['POST'])
@cross_origin()
def updateData():
    if request.method == 'POST':
        posted_data = request.get_json()
        existingRecord = posted_data['existingRecord']        # Fetch the data from request payload
        title = existingRecord['title']
        newdesc = existingRecord['description']
        cur = mysql.connection.cursor()
        cur.execute("UPDATE data SET description=%s WHERE title=%s", (newdesc,title))
        mysql.connection.commit()
        cur.close()
    return jsonify({'result': "successfully updated the record"})

#title as input, the respective present col is changed to 0
@app.route('/deleteRecord', methods=['POST'])
@cross_origin()
def deleteData():
    if request.method == 'POST':
        posted_data = request.get_json()
        existingRecord = posted_data['existingRecord']        # Fetch the data from request payload
        title = existingRecord['title']
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM data WHERE title=%s", (title,))
        mysql.connection.commit()
        cur.close()
    return jsonify({'result': "successfully deleted the record"})

if __name__ == '__main__':
   app.run(debug=True)
