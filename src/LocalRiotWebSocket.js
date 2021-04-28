const WebSocket = require('ws');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const MESSAGE_TYPES = {
    WELCOME: 0,
    PREFIX: 1,
    CALL: 2,
    CALLRESULT: 3,
    CALLERROR: 4,
    SUBSCRIBE: 5,
    UNSUBSCRIBE: 6,
    PUBLISH: 7,
    EVENT: 8
}

class LocalRiotWebSocket extends WebSocket {

    constructor(url) {

        super(url, 'wamp');

        this.session = null;
        this.on('message', this._onMessage.bind(this));

    }

    close() {

        super.close();
        this.session = null;

    }

    terminate() {

        super.terminate();
        this.session = null;

    }

    subscribe(topic, callback) {

        super.addListener(topic, callback);
        this.send(MESSAGE_TYPES.SUBSCRIBE, topic);

    }

    unsubscribe(topic, callback) {

        super.removeListener(topic, callback);
        this.send(MESSAGE_TYPES.UNSUBSCRIBE, topic);

    }

    send(type, message) {

        super.send(JSON.stringify([type, message]));
        
    }

    _onMessage(message) {

        const [type, ...data] = JSON.parse(message);

        switch(type) {

            case MESSAGE_TYPES.WELCOME:
                this.session = data[0];
                break;
            case MESSAGE_TYPES.CALLRESULT:
                console.log('Unknown call', data);
                break;
            case MESSAGE_TYPES.TYPE_ID_CALLERROR:
                console.log('Unknown call error', data);
                break;
            case MESSAGE_TYPES.EVENT:
                const [topic, payload] = data;
                this.emit(topic, payload);
                break;
            default:
                console.log('Unknown type', [type, data]);
                break;

        }

    }

}

module.exports = LocalRiotWebSocket;