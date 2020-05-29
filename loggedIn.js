const puppeteer = require('puppeteer');
const fs = require('fs');
const fastcsv = require('fast-csv');
const creds = require('./creds.json')
/*
MAC TERMINAL COMMAND TO QUICK START
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')

2) COPY THE ENDPOINT URL AND REPLACE THE wsChromeEndPointURL variable

3) Log into linkedin
*/

const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/5cb87e9f-9b76-4578-a02c-01b6713595f6';
async function startBrowser() {
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: null
    });
    const page = await browser.newPage();
    let allResults = []
    for (let i = 1; i <= 11; i++) {
        //Going to url
        console.log("Connecting to URL")
        linkToGoTo = await createURL(i)
        await page.goto(linkToGoTo)
        console.log("Successfully connected")

        let results = await page.evaluate(async () => {
            let queryResults = document.querySelectorAll('.syllabus__item');
            let pageObjs = Array.from(queryResults).map(res => {
                resLink = res.querySelector('a').href
                resTitle = res.querySelector('.syllabus__title').innerText
                return {
                    title: resTitle,
                    link: resLink

                }
            })
            console.log(pageObjs)
            return pageObjs
        })
        allResults = [...allResults, ...results]
    }
    return allResults
}

async function createURL(pageNum) {
    return `https://www.techseries.dev/products/coderpro/categories/1831147?page=${pageNum}`
}

async function main() {
    //CALLING FUNCTION
    //INPUT:
    //PARAM 1: LIST OF COMPANIES TO OSEARCH
    //PARAM 2: HOW MANY PAGES DEEP TO SEARCH
    let result = await startBrowser();
    //WRITING DATA
    const ws = fs.createWriteStream("techProTableOfContent.csv", { flag: 'a' });
    fastcsv
        .write(result, { headers: false })
        .pipe(ws);
}

main()
