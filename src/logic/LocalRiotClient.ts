//@ts-nocheck
const axios = require('axios').default;
import * as fs from 'fs';
import * as https from 'https';

class LocalRiotClientAPI {

    constructor(username, password, port) {

        this.username = username;
        this.password = password;
        this.port = port;

        //local auth header
        this.authorization = Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64');

        //base axios request
        this.axios = axios.create({

            baseURL: `https://127.0.0.1:${this.port}`,
            headers: {
                'Authorization': `Basic ${this.authorization}`,
                "user-agent": "ShooterGame/21 Windows/10.0.19042.1.768.64bit",
                "X-Riot-ClientVersion": "release-02.03-shipping-8-521855",
                "Content-Type": "application/json",
                "rchat-blocking": "true"
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // disable ssl verification for self signed cert used by RiotClientServices.exe,

            })

        });

    }

    static initFromLockFile() {

        const lockFile = this.parseLockFile();
        if(lockFile != "No File found") {

            return new LocalRiotClientAPI('riot', lockFile.password, lockFile.port);

        } else {

            return "No File Found";

        }

    }

    static gameOpen() : boolean {

        const lockFile = this.parseLockFile();
        if(lockFile != "No File found") {

            return true;

        } else {

            return false;

        }
    }

    static parseLockFile() {
    
        const path = `${process.env.LOCALAPPDATA}\\Riot Games\\Riot Client\\Config\\lockfile`;
        console.log(path);      

        // read lockfile
        if(fs.existsSync(path)) {
            const lockfileContents = fs.readFileSync(path, 'utf8');

        /**
         * expected lockfile contents
         * name:pid:port:password:https
         */
            const matches = lockfileContents.split(':');
            const name = matches[0];
            const pid = matches[1];
            const port = matches[2];
            const password = matches[3];
            const protocol = matches[4];

            return {
                'raw': lockfileContents,
                'name': name,
                'pid': pid,
                'port': port,
                'password': password,
                'protocol': protocol,
            }

        } else {

            return "No File found";

        }

    }

    getFriends() {
        return this.axios.get('/chat/v4/friends');
    }

    getSession() {
        return this.axios.get("/chat/v1/session")
    }

    getPresence() {
        return this.axios.get('/chat/v4/presences');
    }

    getHelp() {
        return this.axios.get('/help');
    }

    getCredentials() {
        return this.axios.get("/entitlements/v1/token")
    }

}

module.exports = LocalRiotClientAPI;