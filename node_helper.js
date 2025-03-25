const NodeHelper = require("node_helper");
const https = require("https");
const http = require("http");
const url = require("url");

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification === "GET_MADPLAN") {
      const requestUrl = payload;
      const client = requestUrl.startsWith("https") ? https : http;

      const options = url.parse(requestUrl);

      client
        .get(options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              const json = JSON.parse(data);
              if (!json.madplan) throw new Error("Ugyldigt format");
              this.sendSocketNotification("MADPLAN_DATA", json.madplan);
            } catch (err) {
              console.error("Fejl ved parsing af JSON:", err.message);
              this.sendSocketNotification("MADPLAN_ERROR");
            }
          });
        })
        .on("error", (err) => {
          console.error("Fejl ved HTTP-anmodning:", err.message);
          this.sendSocketNotification("MADPLAN_ERROR");
        });
    }
  }
});
