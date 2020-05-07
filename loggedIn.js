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

const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/fb14c430-a243-4fc0-9199-2c6a8e6d2f70';
const LINKEDIN = "https://www.linkedin.com/feed/?trk=guest_homepage-basic_nav-header-signin"

async function startBrowser(companyToSearch, numPages) {
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(LINKEDIN)
    // ============================
    // TIMER FUNCTION
    // MODIFY THIS TO GET MORE TIME TO MANUALLY CLEAR SECURITY
    // CHECK IF YOU HAVE TO
    // ===========================
    let amountOfSecondsToWait = 3
    await page.waitFor(1000 * amountOfSecondsToWait);

    let combinedResults = []
    for (company of companyToSearch) {
        console.log("COMPANY: " + company)
        let currPage = 1
        while (currPage <= numPages) {
            await page.goto(createSearchURL(company, currPage))
            await page.waitFor(1000);
            await autoScroll(page)

            let links = await page.evaluate(() => {
                let queryResults = document.querySelectorAll('.search-result__info');
                let urls = Array.from(queryResults).map(res => {
                    resName = res.querySelectorAll('.actor-name')[0].innerText
                    resLink = res.querySelectorAll('.search-result__result-link')[0].href
                    resTitle = res.querySelectorAll('.subline-level-1')[0].innerText
                    return {
                        name: resName,
                        title: resTitle,
                        link: resLink,
                    }
                }, this);
                return urls
            })
            for (let i = 0; i < links.length; i++) {
                recruiter = links[i]
                links[i] = { company: company, ...recruiter }
            }
            //Saving results into an array holding all companies
            combinedResults = [...combinedResults, ...links]
            currPage += 1
        }
    }
    return combinedResults
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


function createSearchURL(companySearch, pageToSearch) {
    console.log("CREATING URL FROM: " + companySearch)
    let company = companySearch
    let pageCounter = pageToSearch
    //CAN CHANGE SEARCH TERMS HERE
    //REGULAR
    let searchTerm = `tech%20recruiter%20${company}`
    //UNIVERSITY
    // let searchTerm = `university%20recruiter%20${company}`
    let SEARCHURL = `https://www.linkedin.com/search/results/all/?keywords=${searchTerm}&origin=GLOBAL_SEARCH_HEADER&page=${pageCounter}`
    return SEARCHURL

}


async function main() {
    //CALLING FUNCTION
    //INPUT:
    //PARAM 1: LIST OF COMPANIES TO OSEARCH
    //PARAM 2: HOW MANY PAGES DEEP TO SEARCH
    let result = await startBrowser(
        ["Google", "Apple", "Facebook", "Microsoft",
            "Amazon", "Tesla", "Snapchat", "Linkedin", "Twitter", "Spotify",
            "Hulu", "Two Sigma", "Instagram", "Uber", "Lyft", "Airbnb", "IBM",
            "Intel", "HBO", "Oracle", "Samsung", "HP", "Sony", "Yelp", "AngelList",
            "Verizon", "Boeing", "PayPal", "Reddit", "Qualcomm", "mozilla", "Dell",
            "GE", "Slack", "Palantir", "Stripe", "SpaceX", "Airbnb", "Robinhood",
            "Atlassian", "Epic Games", "DropBox", "Citadel", "Riot", "Intuit",
            "Pinterest", "Bloomberg", "SurveyMonkey", "SalesForce", "Square",
            "Twilio", "Lime", "Peloton", "Blizzard", "Venmo", "DoorDash", "JUUL",
            "Ripple", "Akuna", "Front", "Blend", "Morgan Stanley", "JP Morgan",
            "Goldman Sachs", "Prudential", "Fidelity", "Capital One", "Jane Street",
            "Halliburton", "Visa", "AMEX", "Booze Allen Hamilton", "Cigna"], 2)
    //WRITING DATA
    const ws = fs.createWriteStream("recruiters.csv", { flag: 'a' });
    fastcsv
        .write(result, { headers: false })
        .pipe(ws);
}

main()
