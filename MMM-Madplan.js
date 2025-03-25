Module.register("MMM-Madplan", {
  defaults: {
    url: "",
    updateInterval: 60 * 60 * 1000 // 1 time
  },

  start() {
    this.madplan = [];
    this.loaded = false;
    this.error = false;
    this.getMadplan();
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    setInterval(() => {
      this.getMadplan();
    }, this.config.updateInterval);
  },

  getMadplan() {
    this.sendSocketNotification("GET_MADPLAN", this.config.url);
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "MADPLAN_DATA") {
      this.madplan = payload;
      this.loaded = true;
      this.error = false;
      this.updateDom();
    } else if (notification === "MADPLAN_ERROR") {
      this.error = true;
      this.loaded = true;
      this.updateDom();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      return wrapper;
    }

    if (this.error) {
      wrapper.innerHTML = this.translate("ERROR");
      return wrapper;
    }

    const table = document.createElement("table");
    table.className = "madplan-table";

    this.madplan.forEach(entry => {
      const row = document.createElement("tr");

      const date = new Date(entry.dato);
      const weekday = date.toLocaleDateString("da-DK", { weekday: "long" });
      const dayMonth = date.getDate() + "/" + (date.getMonth() + 1);

      const weekdayCell = document.createElement("td");
      weekdayCell.className = "weekday";
      weekdayCell.innerText = weekday.charAt(0).toUpperCase() + weekday.slice(1);

      const dateCell = document.createElement("td");
      dateCell.className = "date";
      dateCell.innerText = dayMonth;

      const dishCell = document.createElement("td");
      dishCell.className = "dish";
      dishCell.innerText = entry.ret;

      row.appendChild(weekdayCell);
      row.appendChild(dateCell);
      row.appendChild(dishCell);
      table.appendChild(row);
    });

    wrapper.appendChild(table);
    return wrapper;
  },

  getStyles() {
    return ["MMM-Madplan.css"];
  },

  getTranslations() {
    return {
      da: "translations/da.json"
    };
  }
});
