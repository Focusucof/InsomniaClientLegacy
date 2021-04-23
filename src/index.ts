//@ts-nocheck
const LocalRiotClientAPI = require('./logic/LocalRiotClient.js');
const localRiotClient = LocalRiotClientAPI.initFromLockFile();

async function main(userDetails) {
    console.log(userDetails);
}


async function init() {

    await localRiotClient.getCredentials().then(response => {

        var response = {

            playerID: response.data.subject,
            accessToken: response.data.accessToken,
            entitlementToken: response.data.token

        }

        main(response);

    });

}

init();