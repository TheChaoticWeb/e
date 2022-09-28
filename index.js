// app.js

const express = require("express");
const app = express();
const router = require("./routes/index");
const ws = require("express-ws");
const axios = require("axios");

ws(app);
app.use("/", router);

const port = 6969;

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
app.ws("/", (ws, req) => {
  ws.on("message", msg => {
    var { method, url, headers, body, type } = JSON.parse(msg);
    method ??= "GET";
    headers ??= {};
    body ??= "";
    axios.default.defaults.headers.post["Content-Type"] = type ?? "text/plain";
    axios.default.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:70.0) Gecko/20100101 Firefox/70.0";
    axios.default(url, {
      method,
      headers,
      body
    }).then(res => {
      ws.send(JSON.stringify({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data
      }));
      console.log("Sent!");
    });
  });
});
app.ws("/dl", (ws, req) => {
  ws.on("message", msg => {
    axios.default(msg, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:70.0) Gecko/20100101 Firefox/70.0"
      }
    }).then(function(res) {
      ws.send(Buffer.from(res.data));
    }).catch(function() {
      ws.send(Buffer.alloc(69));
    });
  });
});
module.exports = app;
