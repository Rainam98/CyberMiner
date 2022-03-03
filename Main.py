from flask import Flask, render_template, request
import DataRetrival
import json
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index(): 
    return render_template('index.html')

@app.route('/searchWord', methods=['POST'])
def searchWord(): 
    if request.method == 'POST':
        words = str(request.form['search_box'].strip())#Fetch the data from search box
        allColumnsDict = DataRetrival.getData()# All columns dict retrival from DataRetrival.py
        allUrls = list()
        allDesc = list()
        allData = list()
        
        for title in allColumnsDict:
            urlDescDict = {'title':[], 'url':[], 'Description':[]}
            if words.lower() in title.lower() or words.lower() in allColumnsDict[title][0].lower() or words.lower() in allColumnsDict[title][1].lower():
                urlDescDict['title'] = title
                urlDescDict['url']= allColumnsDict[title][0]
                urlDescDict['Description'] = allColumnsDict[title][1]
                allData.append(urlDescDict)
                allUrls.append(allColumnsDict[title][0])
                allDesc.append(allColumnsDict[title][1])
        print(allData)
        return render_template('Results.html', data=allData)

if __name__ == '__main__':
   app.run(debug=True)