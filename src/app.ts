import LocalRiotClientAPI from './LocalRiotClient';
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import * as readline from 'readline-sync';

const localRiotClient = LocalRiotClientAPI.initFromLockFile();
const app = express();
app.use(cors());

/************************HEADER************************/
console.log('\x1b[95m ___                                 _       ');
console.log('|_ _|_ __  ___  ___  _ __ ___  _ __ (_) __ _ ');
console.log(' | || \'_ \\/ __|/ _ \\| \'_ \` _ \\| \'_ \\| |/ _\` |');
console.log(' | || | | \\__ \\ (_) | | | | | | | | | | (_| |');
console.log('|___|_| |_|___/\\___/|_| |_| |_|_| |_|_|\\__,_|');
/******************************************************/

if(localRiotClient == false) {
    console.log('\x1b[0\nmValorant is not currently running...');
    readline.question('Press \x1b[96mENTER\x1b[0m' +' to quit');

    //exit code zero to prevent logging to console
    process.exit(0);
}

var clientVersion = "release-03.02-shipping-5-584286";

//joining logic
app.get("/party/v1/join/:id", async (req: any, res: any) => {

    console.log(typeof(req.params));

    var partyID = req.params.id;
    var userDetails: any = {};
    var credSuccess: boolean = false;

    await localRiotClient.getCredentials().then((response: any) => {

        credSuccess = true;
        userDetails = response.data;

    }).catch((err: object) => {

        res.sendStatus(400);

    });

    if(credSuccess) {

        var region;
        await localRiotClient.getServerRegion().then((response: any) => {

            region = response.data.affinities.live;

        }).catch((error: any) => {

            res.sendStatus(400);

        });

        var partyInfo: any = {};
        await axios.get(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/players/${userDetails.subject}`, {

            headers: {
                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion
            }

        }).then((response: any) => {
            partyInfo = response.data;
        }).catch((error: object) => {
            res.sendStatus(400);
        });

        var joinSuccess;
        await axios.post(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/players/${userDetails.subject}/joinparty/${partyID}`, {}, {
            headers: {
                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion
            }
        }).then((response: any) => {
            joinSuccess = true;
        }).catch((error: any) => {
            if(error.response.status == 404) {
                res.sendStatus(404)
                joinSuccess = false;
            } else {
                joinSuccess = false;
                res.sendStatus(400);
            }
        });

        if(joinSuccess) {

            var json = {
                partyID: partyInfo.CurrentPartyID
            }
            
            res.send(`
            
            <!DOCTYPE html>
    <html>
        <head>
            <title>Insomnia</title>
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
            <link rel="icon" href="https://raw.githubusercontent.com/Focusucof/InsomniaClient/headless/resources/favicon.ico">
        </head>
        <body>
            <div class="main">       
<pre> 
 ___                                 _       
|_ _|_ __  ___  ___  _ __ ___  _ __ (_) __ _ 
 | || \'_ \\/ __|/ _ \\| '_ \` _ \\| '_ \\| |/ _\` |
 | || | | \\__ \\ (_) | | | | | | | | | | (_| |
|___|_| |_|___/\\___/|_| |_| |_|_| |_|_|\\__,_|
</pre>

                <p>You have successfully joined the party</p>
                <p style="color: aqua;">You may close this window</p>

                
            </div>

            <style>
                * {
                    font-family: 'Raleway', sans-serif;
                    background-color: #18191c;
                    color: white;
                }

                p {
                    text-align: center;
                }

                h3 {
                    text-align: center;
                }

                body {
                    position: absolute;
                    left: 50%;
                    top: 40%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                }

                button {
                    position: absolute;
                    left: 50%;
                    top: 105%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                }

                .hover {
                    /* font */
                    color: white;
                    font-size: 20px;
                    font-family: 'Raleway';
                    
                    /* remove blue underline */
                    text-decoration: none;
                    
                    /* border */
                    border: 2px solid #18191c;
                    border-radius: 20px;
                    
                    /* transitions */
                    transition-duration: .2s;
                    -webkit-transition-duration: .2s;
                    -moz-transition-duration: .2s;
                    
                    /* other */
                    background-color: #18191c;
                    padding: 4px 30px;
                }

                .hover:hover {
                    /* update text color and background color */
                    color: #18191c;
                    background-color:white;
                    
                    /* transitions */
                    transition-duration: .2s;
                    -webkit-transition-duration: .11s;
                    -moz-transition-duration: .2s;
                }

                .hover:active {
                    background-color: cyan; 
                }

                pre {
                    font-family: Consolas;
                    font-size: 20pt;
                    color: #f45397;
                }
            </style>
        </body>
    </html>
            
            `);

        }

    }

});

//create logic
app.get("/party/v1/create", async (req: any, res: any) => {

    var userDetails: any = {};
    var credSuccess: boolean = false;

    await localRiotClient.getCredentials().then((response: any) => {
        
        credSuccess = true;
        userDetails = response.data;

    }).catch((error: object) => {

        credSuccess = false;
        res.sendStatus(400);

    }); 

    if(credSuccess) {

        var region;
        await localRiotClient.getServerRegion().then((response: any) => {

            region = response.data.affinities.live;

        }).catch((error: object) => {

            res.sendStatus(400);

        });

        var partyInfo: any = {};
        await axios.get(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/players/${userDetails.subject}`, {

            headers: {
                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion
            }

        }).then((response: any) => {

            partyInfo = response.data;

        }).catch((error: object) => {

            res.sendStatus(400);

        });

        await axios.post(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/parties/${partyInfo.CurrentPartyID}/makecustomgame`, {}, {
            
            headers: {

                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion

            }

        });

        var partyOpen;
        await axios.post(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/parties/${partyInfo.CurrentPartyID}/accessibility`, {Accessibility: "OPEN"}, {
            
            headers: {

                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion

            }

        }).then((response: any) => {

            partyOpen = true;

        }).catch((error: object) => {

            partyOpen = false;
            res.sendStatus(400);

        });

        if(partyOpen == true) {

            res.send(`

            <!DOCTYPE html>
    <html>
        <head>
            <title>Insomnia</title>
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet">
            <link rel="icon" href="https://raw.githubusercontent.com/Focusucof/InsomniaClient/headless/resources/favicon.ico">
        </head>
        <body>
            <div class="main">       
<pre> 
 ___                                 _       
|_ _|_ __  ___  ___  _ __ ___  _ __ (_) __ _ 
 | || '_ \\/ __|/ _ \\| '_ \` _ \\| '_ \\| |/ _\` |
 | || | | \\__ \\ (_) | | | | | | | | | | (_| |
|___|_| |_|___/\\___/|_| |_| |_|_| |_|_|\\__,_|
</pre>

                <p>Your party has been created</p>
                <button class="hover" onclick="copy()">Copy</button>
                <h3 id="partyID">${partyInfo.CurrentPartyID}</h3>
                
            </div>

            <script>
                function copy() {
                    if (window.getSelection) {
                        if (window.getSelection().empty) { // Chrome
                            window.getSelection().empty();
                        } else if (window.getSelection().removeAllRanges) { // Firefox
                            window.getSelection().removeAllRanges();
                        }
                    } else if (document.selection) { // IE?
                        document.selection.empty();
                    }

                    if (document.selection) {
                        var range = document.body.createTextRange();
                        range.moveToElementText(document.getElementById("partyID"));
                        range.select().createTextRange();
                        document.execCommand("copy");
                    } else if (window.getSelection) {
                        var range = document.createRange();
                        range.selectNode(document.getElementById("partyID"));
                        window.getSelection().addRange(range);
                        document.execCommand("copy");
                    }
                }
            </script>

            <style>
                * {
                    font-family: 'Raleway', sans-serif;
                    background-color: #18191c;
                    color: white;
                }

                p {
                    text-align: center;
                }

                h3 {
                    text-align: center;
                }

                body {
                    position: absolute;
                    left: 50%;
                    top: 40%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                }

                button {
                    position: absolute;
                    left: 50%;
                    top: 105%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                }

                .hover {
                    /* font */
                    color: white;
                    font-size: 20px;
                    font-family: 'Raleway';
                    
                    /* remove blue underline */
                    text-decoration: none;
                    
                    /* border */
                    border: 2px solid #18191c;
                    border-radius: 20px;
                    
                    /* transitions */
                    transition-duration: .2s;
                    -webkit-transition-duration: .2s;
                    -moz-transition-duration: .2s;
                    
                    /* other */
                    background-color: #18191c;
                    padding: 4px 30px;
                }

                .hover:hover {
                    /* update text color and background color */
                    color: #18191c;
                    background-color:white;
                    
                    /* transitions */
                    transition-duration: .2s;
                    -webkit-transition-duration: .11s;
                    -moz-transition-duration: .2s;
                }

                .hover:active {
                    background-color: cyan; 
                }

                pre {
                    font-family: Consolas;
                    font-size: 20pt;
                    color: #f45397;
                }
            </style>
        </body>
    </html>
            
            `)

        } 

    }

});

const port = 1337;
app.listen(port, () => {console.log(`\x1b[96mApp running on port ${port}\x1b[0m`)});