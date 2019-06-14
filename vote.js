

// =====================================
// Manually add account that are registered on mnet
// replace account_type with one of 'google','twitter','facebook','tumblr'
// username, password as strings associated to the social media type
// for example ['twitter','my_twitter_username','12345678']
// append to list for more accounts
const methods = [
  [account_type,username,password],
  [account_type,username,password],
]
// =====================================
const Deathbycaptcha = require("Deathbycaptcha");
const puppeteer = require('puppeteer');
const fs = require("fs");
var message;
const votes = [
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/da615811-e09a-41cc-a7e5-7aa41affba5f.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/f8fdd8d0-e981-4a3d-a373-9a664f5c406a.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/37543b73-86f3-4e56-9bf1-f06204482587.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/5fb96638-76c0-4da9-b03f-86464b6d33ec.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/9b5f9483-c8cb-4569-a5e0-8882a283847b.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/797e1374-c172-410d-96c0-03384ff27d0b.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/af8a6b82-b5ac-4149-92e2-e9713be20e7f.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/86d9bf32-c409-4b7e-b056-49b6e1a07617.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/1dfa1eef-a6bc-412e-8794-4251a25ad34e.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/e71effbd-409b-4a2a-8cd8-a0d626388b1d.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/3b393d6f-5373-43bb-abca-e625e88aa854.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/59a882d5-5701-4b5c-8d6e-541378c267a2.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/3ea29163-94cb-402b-910e-b2ff4b4d29b6.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/86cf7fd2-976e-42ec-bac1-3649da2004c5.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/c5cebbb9-6742-4030-a110-5f29b033aeab.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/d7805930-c195-424e-b22d-9a39a263e3e1.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/bd25f1ce-7980-4908-8e9a-e752963ab0bf.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/7304bde4-b6ac-4d1e-953c-d7935ab3ca69.jpg',
  'http://cmsimg.mwave.me/voteItemInfo/imgUrl/201710/26/051e260b-4439-49d4-950f-371f2b1cb2dc.jpg',
];
// const current_time =
const TODAY = get_date()
const date_path = TODAY[0];
const current_time = TODAY[1];
console.log("\n=== "+date_path+" === "+current_time);
function get_date(){
  var today = new Date();
  var year = today.getFullYear().toString();
  var month = (today.getMonth()+1).toString()
  var date = function(){
    d = today.getDate();
    if(d<10){
      return "0"+d.toString()
    } else {
      return d.toString()
    }

  }
  full_date = year+month+date();
  if(!fs.existsSync("./"+full_date)){
    fs.mkdirSync("./"+full_date);
  }
  var min = today.getMinutes() > 9 ? "" + today.getMinutes(): "0" + today.getMinutes();
  return [year+month+date(),today.getHours()+":"+min];
}



(async (methods) => {
  for(meth in methods){
    try{
      var finish = await vote_new_browser(methods[meth]);
      console.log(finish);
    }
    catch(err) {
      console.log("     ERROR:"+err);
    }
  }
})(methods);


// =============================== MAIN =============================

async function vote_new_browser(method){
  return new Promise(async resolve => {
    console.log(method[0]+": "+method[1]);
    // ========= launch =========
    var browser = await puppeteer.launch({
      headless: false,
      executablePath: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
    });
    var page = await browser.newPage();
    await page.setViewport({width: 1280,height: 780});
    await page.goto('http://www.mwave.me/en/signin');

    // ========= login =========
    message = await login(method);
    console.log(message);
    // ========= voting: category =========
    await page.waitForFunction('document.URL == "http://www.mwave.me/en/"');
    await page.goto('http://www.mwave.me/en/mama/vote');
    message = await vote_on_mnet();
    console.log(message);
    // ========= voting: screenshot =========
    message = await full_screenshot(path="./"+date_path+"/result"+method[0]+method[1]+".png");
    console.log(message);
    // ========= voting: submit =========
    await submit_vote();
    [err,message] = await get_captcha(path="./"+date_path+"/captcha"+method[0]+method[1]+".png");
    if(err){
      return resolve("     ======== Require manual help ======== \n"+err)
    }
    console.log(message);
    [err,message] = await wait_for_okay();
    if(err){
      return resolve("     ======== Require manual help ======== \n"+err)
    }
    await browser.close();
    return resolve(message);

    //=================================== async vote_on_mnet ===================================
    async function vote_on_mnet(){
      return new Promise(async resolve => {
        for(x in votes){
          await page.waitForSelector("img[src='"+votes[x]+"']");
          await page.waitForSelector("#select");
          await page.evaluate((vote) => {
            $("img[src='"+vote+"']").click();
            $("#select").click();
          },votes[x]);
        }
        resolve("     categories completed");
      })

    }
    // =================================== login methods ===================================
    async function login(method){
      var meth = method[0];
      var usr_id = method[1];
      var pw = method[2];
      return new Promise(async resolve => {
        if(meth == "google"){
          await page.waitForSelector("li.google a");
          await page.click("li.google a");
          await page.waitForSelector("#identifierId");
          await page.waitForSelector("#identifierNext");
          await page.evaluate((usr_id) => {
            return new Promise(resolve => {
              document.querySelector("#identifierId").value=usr_id;
              document.querySelector("#identifierNext").click();
              resolve("")
            })
          },method[1])
          await page.waitForSelector("input[name='password']");
          await page.waitForSelector("#passwordNext");
          await page.evaluate((pw) => {
            return new Promise(resolve => {
              document.querySelector("input[name='password']").value=pw;
              document.querySelector("#passwordNext").click();
              resolve("")
            })
          },method[2])
          resolve("     logged in");
        } else if (meth == "twitter"){
          await page.waitForSelector("li.twitter a");
          await page.click("li.twitter a");
          await page.waitForSelector("#username_or_email");
          await page.evaluate((usr_id,pw) => {
            return new Promise(resolve => {
              document.getElementById("username_or_email").value=usr_id;
              document.getElementById("password").value=pw;
              document.getElementById("allow").click();
              resolve("")
            })
          },method[1],method[2]);
          resolve("     logged in");
        } else if (meth == "facebook"){
          await page.waitForSelector("li.facebook a");
          await page.click("li.facebook a");
          await page.waitFor(5000);
          await page.evaluate((usr_id,pw) => {
            return new Promise(resolve => {
              document.getElementById("email").value=usr_id;
              document.getElementById("pass").value=pw;
              document.getElementById("loginbutton").click();
              resolve("")
            })
          },method[1],method[2]);
          resolve("     logged in");
        } else if (meth == "tumblr"){
          await page.waitForSelector("li.tumblr a");
          await page.click("li.tumblr a");
          await page.waitForSelector("#signup_determine_email");
          await page.waitForSelector("#signup_forms_submit > span.signup_determine_btn.active");
          await page.evaluate((usr_id) => {
            return new Promise(resolve => {
              document.querySelector("#signup_determine_email").value=usr_id;
              document.querySelector("#signup_forms_submit > span.signup_determine_btn.active").click();
              resolve("")
            })
          },method[1])

          await page.waitFor(4000);
          await page.evaluate((pw) => {
            return new Promise(resolve => {
              document.querySelector("#signup_password").value=pw;
              document.querySelector("#signup_forms_submit > span.signup_login_btn.active").click();
              resolve("")
            })
          },method[2])

          await page.waitFor(4000);
          await page.evaluate(() => {
            return new Promise(resolve => {
              document.querySelector("button[type='submit'][name='allow']").click();
              resolve("")
            })

          })
          resolve("     logged in");
        } else {
          throw "Error: wrong login method";
        }
      })
    }
    // =============================== Deathbycaptcha ========================================
    async function submit_vote(){
      return new Promise(async resolve => {
        await page.waitForSelector("#mamaResultList > div > div.btn_wrap.mt50.ac > a");
        await page.evaluate(() => {
          $("#mamaResultList > div > div.btn_wrap.mt50.ac > a").click();
        })
        resolve("     submited")
      })
    }

    async function get_captcha(path){
      await screenshotDOMEElement("#_captcha_image_voteCaptcha",path);
      console.log("     obtained captcha");
      var dbc = new Deathbycaptcha("username","password"); //Deathbycaptcha username and password
      return new Promise(async resolve => {
        dbc.solve(fs.readFileSync(path),async function(err,id,solution){
          if(err){
            resolve(["get_captcha Error:"+err,null]);
          } else {
            console.log("     solution:"+solution);
            await page.evaluate((solution) => {
              $("#_captcha_value_voteCaptcha").val(solution);
            },solution);
            await page.evaluate(() => {
              $("#_captcha_validate_voteCaptcha").click();
            })
            resolve([null,"     clicked submit"]);
          }
        })
      })
    }
    async function wait_for_okay(){
      return new Promise(async resolve => {
        try {
          await page.waitForSelector("#_okBtn",{
            visible:true,
          });

          var m = await page.evaluate(() => {
            var selector = "#modalAlert > div.modal_wrap > div > div > div > div.lp_body.pd0.pop > p";
            return Promise.resolve(document.querySelector(selector).textContent)
          });
          if(m=="Thank you for voting!"){
            resolve([null,"     completed"]);
          } else {
            resolve(["text does not match: "+m.textContent,null]);
          }
        }
        catch(err) {
          resolve([err,null]);
        }
      })
    }
    async function screenshotDOMEElement(selector,path){
      await page.waitForSelector(selector);
      await page.waitFor(2000);
      var area = await page.evaluate((selector) => {
        var element = document.querySelector(selector);
        return element.getBoundingClientRect();
      },selector);
      return await page.screenshot({
        path:path,
        clip:area,
      })
    }

    // =============================== Fullscreen screenshot ========================================
    async function full_screenshot(path){
      return new Promise(async resolve => {
        await page.setViewport({width: 1280,height: 3000});
        await page.screenshot({
          path:path,
        });
        await page.setViewport({width: 1280,height: 780});
        resolve("     screenshot done")
      })

    }
  })
};
