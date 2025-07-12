
import WebSocket from 'ws';
import {trafficData} from './data.js';

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Connected to server');

    let rowIndex = 0;

    const sendData = () => {
        let anyDataSent = false;

        for (const place of trafficData) {
            if (place.data[rowIndex]) {
                const payload = {
                    place: place.name,
                    ...place.data[rowIndex]
                };
                ws.send(JSON.stringify(payload));
                anyDataSent = true;
            }
        }

        rowIndex++;

        if (anyDataSent) {
            setTimeout(sendData, 10000); // Wait 1 sec before sending next batch
        } else {
            console.log("All data sent.");
            ws.close();
        }
    };

    sendData();
});

ws.on('message', (message) => {
    console.log('Received from server:', message.toString());
});

ws.on('close', () => {
    console.log('Connection closed');
});
