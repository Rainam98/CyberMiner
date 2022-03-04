import csv
def getData():
    c = open('URL_data.csv','r')
    o = csv.reader(c)
    res = dict()
    for r in o:
        res[r[0]] = [r[1], r[2]]
    c.close()
    del res['ï»¿Title']
    return res
