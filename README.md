# Point of this Project?
The point is to use the results with a service like: Rocketreach.co and their extension https://rocketreach.co/ and their extension https://chrome.google.com/webstore/detail/rocketreach-chrome-extens/oiecklaabeielolbliiddlbokpfnmhba?hl=en-US

The service basically allows you to use their extension to be on a Linkedin page and to grab their email from the Linkedin page. This sheet also allows you to quickly scan for recruiters that are relevant to you, whether university recruiter or so on.

# Two ways to Run

## Make sure you did npm install if you are cloning this repo

## Method one (Let Puppeteer Start Up a Chrome Browser and run for you) (npm start):
### index.js
1. First put your credentials in the creds.json
2. When you do npm start a browser will open up and log you in
3. You can change the variable "amountOfSecondsToWait" in index.js to change the amount of seconds to wait after it clicks the submit button: 
> let amountOfSecondsToWait = 120
4. This might be bc you need to solve the security clearance question / captchas
5. You will know the time you set is too short if you are suddenly being redirected as solving captchas, since the program will assume that it is logged in. You can always just send an interrupt command through terminal in order to stop the program
6. If the amountOfSeconds to wait is too long, you can change it to a value like 10.
7. To change the companies you want to search for and how many pages of results you can change:
>     let result = await startBrowser(
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
8. The above takes a list of companies to look for, and an integer value on how many pages to check

## Method Two (Prestart with a Chrome Browser) (npm run security):
### loggedIn.js
1. Follow this Link on how to prestart a chrome browser
https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8a10828149e0
2. copy the endpoint link you get and replace the endpoint link in the file loggedIn.js with the new updated link:
> const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/fb14c430-a243-4fc0-9199-2c6a8e6d2f70';
3. Log into Linkedin on that opened up Chrome Browser running in dev mode
4. The program runs similarly to the method 1. Give it an array of companies you want to search for, an integer on how pages, and just run the command npm run security to let it run.

## Note if you want to change the search term....

> let searchTerm = `tech%20recruiter%20${company}`

You can change the search term by going to the index.js or the loggedIn.js and changing the search term variable. Just ctrl + f to find it. I grabbed the search term template I wanted to use, by just searching in Linkedin, grabbing the URL parameter, and copying and pasting it there. But I'm sure anyone using this can figure out the pattern on if you wanted to search: 'tech recruiter ____' or 'some random term {insert company}'

Already have some defaults you can comment in and out:
"
    //REGULAR
    let searchTerm = `tech%20recruiter%20${company}`
    //UNIVERSITY
    let searchTerm = `university%20recruiter%20${company}`
"

If you are using a term like university recruiter btw, I don't think you need to search beyond 1 page.
