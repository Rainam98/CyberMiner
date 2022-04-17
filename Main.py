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

# both word1 and word2 are present in desc
def searchAnd(word1, word2):
    allColumnsDict = getData()
    searchedData = list()
    for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'Description':[]}
            if (word1.lower() in allColumnsDict[title][1].lower() and word2.lower() in allColumnsDict[title][1].lower()):
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ')
                urlDescDict['title'] = title1
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['Description'] = desc
                searchedData.append(urlDescDict)
    return searchedData
# either word1 and word2 are present in desc
def searchOr(word1, word2):
    allColumnsDict = getData()
    searchedData = list()
    for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'Description':[]}
            if word1.lower() in allColumnsDict[title][1].lower() or word2.lower() in allColumnsDict[title][1].lower():
                title1 = title.replace('Â', '').replace('\xa0', ' ')
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ')
                urlDescDict['title'] = title1
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['Description'] = desc
                searchedData.append(urlDescDict)
    return searchedData
#  word1 but not word2 are present in desc
def searchNot(word1, word2):
    allColumnsDict = getData()
    searchedData = list()
    for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'Description':[]}
            if word1.lower() in allColumnsDict[title][1].lower() and (not(word2.lower() in allColumnsDict[title][1].lower())):
                title1 = title.replace('Â', '').replace('\xa0', ' ')
                desc = allColumnsDict[title][1].replace('Â', '').replace('\xa0', ' ')
                urlDescDict['title'] = title1
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['Description'] = desc
                searchedData.append(urlDescDict)
    return searchedData

def binOper(word1, word2, opr):
    if opr == "AND":
        return searchAnd(word1, word2)
    elif opr == "OR":
        return searchOr(word1, word2)
    elif opr == "NOT":
        return searchNot(word1, word2)


# the keywords are only searched in the description
@app.route('/binarysearch', methods=['POST'])
def BinarySearch():
    if request.method == 'POST':
        words = str(request.form['binary_search_box'].strip())
        wordOpers = words.split()
        if wordOpers[1] == 'AND':
            res = searchAnd(wordOpers[0], wordOpers[2])
        elif wordOpers[1] == 'OR':
            res = searchOr(wordOpers[0], wordOpers[2])
        elif wordOpers[1] == 'NOT':
            res = searchNot(wordOpers[0], wordOpers[2])
    return render_template('Results.html', data=res)

# user is requested for title, url, desc and new row is created
@app.route('/create', methods=['POST'])
def Pushdata():
    if request.method == 'POST':
        title = str(request.form['Title'].strip())
        url = str(request.form['Url'].strip())
        desc = str(request.form['Desc'].strip())
        cur = mysql.connection.cursor()
        pres = 1
        cur.execute("INSERT INTO cdata (title, url, description, present) VALUES (%s, %s, %s, %s)", (title, url, desc, pres))
        mysql.connection.commit()
        cur.close()
    return render_template('Results.html', data="successfully created new record")

#title and new desc as input, new desc is updated for respective title
@app.route('/update', methods=['POST'])
def Updatedata():
    if request.method == 'POST':
        title = str(request.form['Title'].strip())
        newdesc = str(request.form['Newdesc'].strip())
        cur = mysql.connection.cursor()
        pres = 1
        cur.execute("UPDATE cdata SET description=%s WHERE title=%s", (newdesc,title))
        mysql.connection.commit()
        cur.close()
    return render_template('Results.html', data="successfully Updated the record")

#title as input, the respective present col is changed to 0
@app.route('/delete', methods=['POST'])
def Deletedata():
    if request.method == 'POST':
        title = str(request.form['Title'].strip())
        cur = mysql.connection.cursor()
        cur.execute("UPDATE cdata SET present=%s WHERE title=%s", (0,title))
        mysql.connection.commit()
        cur.close()
    return render_template('Results.html', data="successfully deleted the record")

if __name__ == '__main__':
   app.run(debug=True)
