"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
var app = (0, express_1.default)();
app.use(express_1.default.json());
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
server.listen(PORT, function () {
    console.log('Server running on PORT:', PORT);
});
