CyberMiner
Team members added

Rainam Shah
Dhyani Gandhi
Dharav Bhatt
Akash Karuturi
Rohith Jallipalli
Yasaswi Devi Tiyyagura
Poojitha Bijjam
Rutvik Avaiya
Chenyue Li
Yang Yang
Steps to run Frontend code:

Pull Frontend code to local using:
git checkout master
git pull -r
Run npm install to install all packages locally
Run npm start to start frontend server
The homepage should load automatically after successfully running npm start, if not, enter localhost:3000 in browser url.
To stop react server, use ctrl + C
Steps to add/merge changes:

Switch to master branch and pull the latest change from master branch using:

git checkout master
git pull -r
Switch to your own branch and rebase from master changes so the latest changes will be sync-ed in your local branch using:

git checkout <your_branch_name>
git rebase master
Update on your local branch

Upon finishing changes on your local branch, use the following command to commit the changes and push to the remote branch:

git add -
git commit -m "<commit_message>"
git push --set-upstream origin <your_branch_name>
Upon all changes are committed and pushed, go to the github page https://github.com/Rainam98/CyberMiner and raise pull request for code review:

Click on "Pull requests" tab
Click on "New pull request" button
On the Compare changes page, make sure the base branch is master and compared branch is your own branch
Click on "New pull request" button
Edit title and description of the pull request to specify the changes/features you added
Assign reviewer to review the pull request on the side bar
Frontend code reviewer: Rainam
Backend code reviewer: Poojitha
Click on "Create pull request" button to submit
Code reviewer will review the changes. Once approved, the pull request will be resolved and changes will be merged into master branch


Steps to run Backend code:

 - install the python runtime dependencies using
        `pip install -r requirements.txt`

 - Run the file Main.py using python3 (Virtual Environment Preferably).
        Unix - `Python Main.py`
        Windows - `Py Main.py`

 - Open `http://127.0.0.1:5000/` in browser.