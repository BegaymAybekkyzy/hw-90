import express from 'express';
import expressWs from "express-ws";
import cors from 'cors';
import {WebSocket} from "ws";
import {IncomingMessage} from "./types";

const app = express();
const wsInstance = expressWs(app);

const port = 8000;
app.use(cors());

const router = express.Router();
wsInstance.applyTo(router);

const connectedClients: WebSocket[] = [];

router.ws("/draw-online", (ws, _req) => {
    try {
        console.log('Client connected');

        ws.on("message", (message) => {
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

            if(decodedMessage.type === "SEND_MESSAGE") {
                connectedClients.forEach(clientWs => {
                    clientWs.send(JSON.stringify({
                        type: "NEW_MESSAGE",
                        payload: decodedMessage.payload
                    }));
                })
            }
        });

        connectedClients.push(ws);
        ws.on("close", () => {
            console.log("Client disconnected");
        });
    }catch (error) {
        ws.send(JSON.stringify({error: "Invalid message"}))
    }
});

app.use(router);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});