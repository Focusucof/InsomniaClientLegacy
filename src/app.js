const LocalRiotClientAPI = require('./LocalRiotClient.js');
const localRiotClient = LocalRiotClientAPI.initFromLockFile();
const express = require('express');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(cors());

var clientVersion = "release-02.07-shipping-6-546329";

//joining logic
app.get("/party/v1/join/:id", async (req, res) => {

    var partyID = req.params.id;
    var userDetails;
    var credSuccess;

    await localRiotClient.getCredentials().then(response => {

        credSuccess = true;
        userDetails = response.data;

    }).catch(err => {

        res.send(400);

    });

    if(credSuccess) {

        var region;
        await localRiotClient.getServerRegion().then(response => {

            region = response.data.affinities.live;

        }).catch(error => {

            res.send(400);

        });

        var partyInfo;
        await axios.get(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/players/${userDetails.subject}`, {

            headers: {
                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }

        }).then(response => {
            partyInfo = response.data;
        }).catch(error => {
            res.send(400);
        });

        var joinSuccess;
        await axios.post(`https://glz-${region}}-1.${region}.a.pvp.net/parties/v1/players/${userDetails.subject}/joinparty/${partyID}`, {}, {
            headers: {
                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion
            }
        }).then(response => {
            joinSuccess = true;
        }).catch(error => {
            if(error.response.status == 404) {
                res.send(404)
                joinSuccess = false;
            } else {
                joinSuccess = false;
                res.send(400);
            }
        });

        if(joinSuccess) {

            var json = {
                partyID: partyInfo.CurrentPartyID
            }
            
            res.send(200).send(json);

        }

    }

});

//create logic
app.get("/party/v1/create", async (req, res) => {

    var userDetails;
    var credSuccess;

    await localRiotClient.getCredentials().then(response => {
        
        credSuccess = true;
        userDetails = response.data;

    }).catch(error => {

        credSuccess = false;
        res.send(400);

    }); 

    if(credSuccess) {

        var region;
        await localRiotClient.getServerRegion().then(response => {

            region = response.data.affinities.live;

        }).catch(error => {

            res.send(400);

        });

        var partyInfo;
        await axios.get(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/players/${userDetails.subject}`, {

            headers: {
                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion
            }

        }).then(response => {

            partyInfo = response.data;

        }).catch(error => {

            res.send(400);

        });

        var partyOpen;
        await axios.post(`https://glz-${region}-1.${region}.a.pvp.net/parties/v1/parties/${partyInfo.CurrentPartyID}/accessibility`, {Accessibility: "OPEN"}, {
            
            headers: {

                "Authorization": `Bearer ${userDetails.accessToken}`,
                "X-Riot-Entitlements-JWT": userDetails.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  clientVersion

            }

        }).then(response => {

            partyOpen = true;

        }).catch(error => {

            partyOpen = false;
            res.sendStatus(400);

        });

        if(partyOpen == true) {

            var json = {

                partyID: partyInfo.CurrentPartyID

            }

            res.status(200).send(json);

        } 

    }

});

const port = 1337;
app.listen(port, () => {console.log(`App running on port ${port}`)});