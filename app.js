const path = require('path');
const http = require('http');
const express = require('express');
const WebSocketServer = require('ws').Server;

const app = express();
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
const server = http.createServer(app);

const wsServer = new WebSocketServer({ server });

const connections = [];
wsServer.on("connection", connection => {
  connections.push(connection);
  console.log("(+) new connection. total connections:", connections.length);

  connection.on("message", message => console.log(JSON.parse(message)));

  connection.on("close", () => {
    connections.splice(connections.indexOf(connection), 1);
    console.log("(-) connection lost. total connections:", connections.length);
  });
});

app.get('/', (req, res) => res.sendFile('chat.html', {root: path.join(__dirname, "views")}));

const port = 3000;
server.listen(port, () => console.log(`Web server started at ${port}`));