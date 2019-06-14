# Script to vote automatically with multiple social media accounts for MAMA2017 (outdated)
This script requires a pre registered social media accounts that a eligible to voting for MAMA2017 and a paid Deathbycaptcha account
## initial setup
1. Install dependencies : Google Chrome Canary, nodejs (puppeteer, Deathbycaptcha)
2. Add social media accounts and Deathbycaptcha account credentials in `vote.js` (more instruction is given in the code)  
3. Assign log file path in `now_vote.sh`

## to vote
Run `now_vote.sh` on terminal to vote. Log file is appended every time the script is ran. Vote proof of every account in the form of screen shots are saved in `./YYYYMMDD/`. Captcha needs to be solved manually if Deathbycaptcha fails in first attempt. 
