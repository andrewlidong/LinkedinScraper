const puppeteer = require('puppeteer');
const neatCsv = require('neat-csv');
const fs = require('fs');
const fastcsv = require('fast-csv');

//TESTING
const YO_SCOTT_DISCORD_PAGE = "https://discord.com/channels/590298536713781258/684186666432331787"
//REAL
// const YO_SCOTT_DISCORD_PAGE = "https://discord.com/channels/590298536713781258/684186666432331787"
const YO_SCOTT_TEXTBOX = "Message #yoscott"
const YO_SCOTT_PHRASE = "YO SCOTT!"
let LOGIN_SUCCESS = true

async function startBrowser() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    //CREATING THE PAGE
    const page = await browser.newPage();
    await page.goto(YO_SCOTT_DISCORD_PAGE)
    await page.waitFor(2000);

    //LOGIN LOGIC
    if (page.url() != YO_SCOTT_DISCORD_PAGE) {
        await page.type('[name=email]', 'justinlinw99@gmail.com');
        await page.type('[name=password]', 'k5vn58x*@m^jWF@ElzlX');
        await page.click('[type=submit]');
        await page.waitFor(5000);
        try {
            await page.click('[class=recaptcha-checkbox-checkmark]');
        } catch{
            console.log("Dang it! Didn't make it pass security! OR YAY NO CAPTCHA HAHA")
        }
    }

    //IF SUCCESSFUL START TYPING
    if (LOGIN_SUCCESS) {
        await page.waitFor(3000);
        let streakCount = await readCSV()
        let phraseToType = YO_SCOTT_PHRASE

        await page.keyboard.type(phraseToType);
        await page.keyboard.down("Shift")
        await page.keyboard.press("Enter")
        await page.keyboard.up("Shift")
        await page.keyboard.type("STREAK: " + streakCount);
        await page.keyboard.press("Enter")
        //EXIT THE PAGE
    } else {
        //WHAT TO DO 
    }

}

//FUNCTION TO HANDLE CSV
async function readCSV() {
    return new Promise(function (resolve, reject) {
        fs.readFile('./streak.csv', async (err, data) => {
            if (err) {
                console.error(err)
                reject(err)
                return
            }
            let streakObj = await neatCsv(data)
            streakObj[0]["Streak Count"] = parseInt(streakObj[0]["Streak Count"]) + 1
            const ws = fs.createWriteStream("streak.csv");
            fastcsv
                .write(streakObj, { headers: true })
                .pipe(ws);
            resolve(streakObj[0]["Streak Count"])
        })
    })
}

startBrowser()
