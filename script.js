const schedule = [
  {
    name: "RSI",
    timestamp: 1763654400, // Nov 20, 2025 - 16:00 UTC
    location: "Apex Hall",
    limitedSales: "Constellation Phoenix",
    waveTimestamps: [
      1763654400, // Nov 20, 2025 - 16:00 UTC
      1763668800, // Nov 20, 2025 - 20:00 UTC
      1763683200, // Nov 21, 2025 - 00:00 UTC
      1763697600, // Nov 21, 2025 - 04:00 UTC
      1763712000, // Nov 21, 2025 - 08:00 UTC
      1763726400  // Nov 21, 2025 - 12:00 UTC
    ]
  },
  {
    name: "Origin",
    timestamp: 1763740800, // Nov 21, 2025 - 16:00 UTC
    location: "Zenith Hall",
    limitedSales: "890 Jump",
    waveTimestamps: [
      1763740800, // Nov 21, 2025 - 16:00 UTC
      1763755200, // Nov 21, 2025 - 20:00 UTC
      1763769600, // Nov 22, 2025 - 00:00 UTC
      1763784000, // Nov 22, 2025 - 04:00 UTC
      1763798400, // Nov 22, 2025 - 08:00 UTC
      1763812800  // Nov 22, 2025 - 12:00 UTC
    ]
  },
  {
    name: "Drake",
    timestamp: 1763827200, // Nov 22, 2025 - 16:00 UTC
    location: "Apex Hall",
    limitedSales: "Kraken, Kraken Privateer, Kraken Conversion Kit",
    waveTimestamps: [
      1763827200, // Nov 22, 2025 - 16:00 UTC
      1763841600, // Nov 22, 2025 - 20:00 UTC
      1763856000, // Nov 23, 2025 - 00:00 UTC
      1763870400, // Nov 23, 2025 - 04:00 UTC
      1763884800, // Nov 23, 2025 - 08:00 UTC
      1763899200  // Nov 23, 2025 - 12:00 UTC
    ]
  },
  {
    name: "Alien Manufacturers",
    timestamp: 1763913600, // Nov 23, 2025 - 16:00 UTC
    location: "Zenith Hall"
  },
  {
    name: "MISC, MIRAI",
    timestamp: 1764000000, // Nov 24, 2025 - 16:00 UTC
    location: "Apex Hall",
    limitedSales: "Hull E",
    waveTimestamps: [
      1764000000, // Nov 24, 2025 - 16:00 UTC
      1764014400, // Nov 24, 2025 - 20:00 UTC
      1764028800, // Nov 25, 2025 - 00:00 UTC
      1764043200, // Nov 25, 2025 - 04:00 UTC
      1764057600, // Nov 25, 2025 - 08:00 UTC
      1764072000  // Nov 25, 2025 - 12:00 UTC
    ]
  },
  {
    name: "Anvil Aerospace",
    timestamp: 1764086400, // Nov 25, 2025 - 16:00 UTC
    location: "Zenith Hall"
  },
  {
    name: "ARGO, CNOU, Greycat, Kruger",
    timestamp: 1764172800, // Nov 26, 2025 - 16:00 UTC
    location: "Zenith Hall",
    limitedSales: "Consolidated Outland Pioneer",
    waveTimestamps: [
      1764172800, // Nov 26, 2025 - 16:00 UTC
      1764187200, // Nov 26, 2025 - 20:00 UTC
      1764201600, // Nov 27, 2025 - 00:00 UTC
      1764216000, // Nov 27, 2025 - 04:00 UTC
      1764230400, // Nov 27, 2025 - 08:00 UTC
      1764244800  // Nov 27, 2025 - 12:00 UTC
    ]
  },
  {
    name: "Crusader and Tumbril",
    timestamp: 1764259200, // Nov 27, 2025 - 16:00 UTC
    location: "Apex Hall"
  },
  {
    name: "Aegis Dynamics",
    timestamp: 1764345600, // Nov 28, 2025 - 16:00 UTC
    location: "Zenith Hall",
    limitedSales: "Idris-P, Javelin, Idris K Kit",
    waveTimestamps: [
      1764345600, // Nov 28, 2025 - 16:00 UTC
      1764360000, // Nov 28, 2025 - 20:00 UTC
      1764374400, // Nov 29, 2025 - 00:00 UTC
      1764388800, // Nov 29, 2025 - 04:00 UTC
      1764403200, // Nov 29, 2025 - 08:00 UTC
      1764417600  // Nov 29, 2025 - 12:00 UTC
    ]
  },
  {
    name: "Best In Show",
    timestamp: 1764432000, // Nov 29, 2025 - 16:00 UTC
    location: "Zenith Hall"
  },
  {
    name: "IAE 2955 Finale",
    timestamp: 1764518400, // Nov 30, 2025 - 16:00 UTC
    location: "Zenith Hall",
    end: 1764777600 // Dec 3, 2025 - 16:00 UTC
  }
];

function populateTimeZones() {
  const timeZones = Intl.supportedValuesOf("timeZone");
  const selector = document.getElementById("timezone-selector");
  timeZones.forEach(zone => {
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = zone;
    selector.appendChild(option);
  });
  selector.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById("timezone-info").textContent = `Your timezone is ${selector.value} and the schedule is based on that.`;
}

function convertTimestampToLocaleString(timestamp, timeZone) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-US", { timeZone, hour12: true });
}

function getTimeLeft(timestamp, nextTimestamp, endTimestamp) {
  const now = new Date().getTime() / 1000;
  let timeLeft;
  let isHappening;
  let hasPassed;

  if (endTimestamp) {
    const timeUntilEnd = endTimestamp - now;
    timeLeft = calculateTimeLeft(timeUntilEnd);
    isHappening = now >= timestamp && now <= endTimestamp;
    hasPassed = now > endTimestamp;
  } else {
    const duration = nextTimestamp ? (nextTimestamp - timestamp) : 86400;
    const timeUntilStart = timestamp - now;
    timeLeft = calculateTimeLeft(timeUntilStart);
    isHappening = timeUntilStart <= 0 && timeUntilStart > -duration;
    hasPassed = timeUntilStart <= -duration;
  }

  return { text: timeLeft, isHappening, hasPassed };
}

function calculateTimeLeft(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);

  let timeLeftText;
  if (days > 0) {
    timeLeftText = `${days}d:${hours.toString().padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m`;
  } else {
    timeLeftText = `${hours.toString().padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m:${secondsLeft.toString().padStart(2, "0")}s`;
  }
  return timeLeftText;
}

function updateSchedule() {
  const now = new Date().getTime() / 1000;

  const shipLinks = {
    "Idris-P":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=idris&sort=weight&direction=desc",
    Javelin:
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=javelin&sort=weight&direction=desc",
    "Idris K Kit":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=Idris+P+After+Market+Kit&sort=weight&direction=desc",
    "890 Jump":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=890&sort=weight&direction=desc",
    "Constellation Phoenix":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=phoenix&sort=weight&direction=desc",
    Kraken:
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken&sort=weight&direction=desc",
    "Kraken Conversion Kit":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken+conversion&sort=weight&direction=desc",
    "Kraken Privateer":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken+privateer&sort=weight&direction=desc",
    "Hull E":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=hull+e&sort=weight&direction=desc",
    "Consolidated Outland Pioneer":
      "https://robertsspaceindustries.com/store/pledge/browse/extras/?search=pioneer&sort=weight&direction=desc"
  };

  const selectedTimeZone = document.getElementById("timezone-selector").value;
  const scheduleContainer = document.getElementById("schedule");
  scheduleContainer.innerHTML = "";

  schedule.forEach((event, index) => {
    const nextEventTimestamp =
      index < schedule.length - 1 ? schedule[index + 1].timestamp : null;
    const eventTimeLeft = getTimeLeft(
      event.timestamp,
      nextEventTimestamp,
      event.end
    );

    let eventHTML = `<div class="event${
      eventTimeLeft.hasPassed ? " finished-event" : ""
    }">`;

    if (eventTimeLeft.isHappening) {
      eventHTML = `<div class="event event-active">`;
      const endTime = event.end ? event.end : event.timestamp + 24 * 3600;
      const timeLeftToEnd = endTime - now;

      let timeLeftText;
      if (timeLeftToEnd > 0) {
        timeLeftText = calculateTimeLeft(timeLeftToEnd);
      } else {
        timeLeftText = "Finished";
      }

      eventHTML += `<div class="event-name happening-now">${
        event.name
      } - Happening Now in ${
        event.location
      }<span class="time-left">${timeLeftText}</span></div>`;
    } else if (eventTimeLeft.hasPassed) {
      eventHTML += `<div class="event-name finished">${event.name} - Finished</div>`;
    } else {
      const diffInSeconds = event.timestamp - now;
      if (diffInSeconds > 0 && diffInSeconds <= 86400) {
        eventHTML += `<div class="event-name">${event.name}</div>
          <div class="location">Event starting soon in: ${
            eventTimeLeft.text
          } at ${convertTimestampToLocaleString(
          event.timestamp,
          selectedTimeZone
        )} [${event.location}]</div>`;
      } else {
        eventHTML += `<div class="event-name">${event.name}</div>
          <div class="location">${convertTimestampToLocaleString(
            event.timestamp,
            selectedTimeZone
          )} [${event.location}]</div>`;
      }
    }

    if (event.limitedSales) {
      let limitedSalesLinks = "";
      const sales = event.limitedSales.split(", ");
      sales.forEach(sale => {
        const link = shipLinks[sale.trim()];
        if (link) {
          limitedSalesLinks += `<a href="${link}" class="limited-sales-link" target="_blank">${sale}</a>, `;
        } else {
          limitedSalesLinks += `${sale}, `;
        }
      });
      limitedSalesLinks = limitedSalesLinks.slice(0, -2);

      eventHTML += `<div class="limited-sales">Limited Ship Sales: ${limitedSalesLinks}</div>`;

      event.waveTimestamps.forEach((waveTimestamp, waveIndex) => {
        const nextWaveTimestamp =
          waveIndex < event.waveTimestamps.length - 1
            ? event.waveTimestamps[waveIndex + 1]
            : waveTimestamp + 4 * 3600; // last wave = 4h window

        const waveTimeLeft = getTimeLeft(waveTimestamp, nextWaveTimestamp);

        let waveStatus;
        if (waveTimeLeft.isHappening) {
          waveStatus = `Wave ${
            waveIndex + 1
          }: <span class="wave-happening-now">Started. Good Luck!</span>`;
        } else if (waveTimeLeft.hasPassed) {
          waveStatus = `Wave ${
            waveIndex + 1
          }: <span class="finished-wave">Passed</span>`;
        } else {
          waveStatus = `Wave ${waveIndex + 1}: ${waveTimeLeft.text}`;
        }

        eventHTML += `<div class="wave">${waveStatus}</div>`;
      });
    }

    eventHTML += `</div>`;
    scheduleContainer.innerHTML += eventHTML;
  });
}

window.onload = () => {
  populateTimeZones();
  updateSchedule();
  setInterval(updateSchedule, 1000);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("action") === "copyToDiscord") {
    copyToDiscord();
  }
};

function copyToDiscord() {
  const discordSchedule =
    `IAE 2955 Official Schedule:\n\n` +
    `**RSI:**\n<t:1763654400:f> [Apex Hall <t:1763654400:R>]\nLimited Ship Sales: Constellation Phoenix\n` +
    `Wave 1: <t:1763654400:T>, Wave 2: <t:1763668800:T>, Wave 3: <t:1763683200:T>, Wave 4: <t:1763697600:T>, Wave 5: <t:1763712000:T>, Wave 6: <t:1763726400:T>\n\n` +
    `**Origin:**\n<t:1763740800:f> [Zenith Hall <t:1763740800:R>]\nLimited Ship Sales: 890 Jump\n` +
    `Wave 1: <t:1763740800:T>, Wave 2: <t:1763755200:T>, Wave 3: <t:1763769600:T>, Wave 4: <t:1763784000:T>, Wave 5: <t:1763798400:T>, Wave 6: <t:1763812800:T>\n\n` +
    `**Drake:**\n<t:1763827200:f> [Apex Hall <t:1763827200:R>]\nLimited Ship Sales: Kraken, Kraken Privateer, Kraken Conversion Kit\n` +
    `Wave 1: <t:1763827200:T>, Wave 2: <t:1763841600:T>, Wave 3: <t:1763856000:T>, Wave 4: <t:1763870400:T>, Wave 5: <t:1763884800:T>, Wave 6: <t:1763899200:T>\n\n` +
    `**Alien Manufacturers:**\n<t:1763913600:f> [Zenith Hall <t:1763913600:R>]\n\n` +
    `**MISC, MIRAI:**\n<t:1764000000:f> [Apex Hall <t:1764000000:R>]\nLimited Ship Sales: Hull E\n` +
    `Wave 1: <t:1764000000:T>, Wave 2: <t:1764014400:T>, Wave 3: <t:1764028800:T>, Wave 4: <t:1764043200:T>, Wave 5: <t:1764057600:T>, Wave 6: <t:1764072000:T>\n\n` +
    `**Anvil Aerospace:**\n<t:1764086400:f> [Zenith Hall <t:1764086400:R>]\n\n` +
    `**ARGO, CNOU, Greycat, Kruger:**\n<t:1764172800:f> [Zenith Hall <t:1764172800:R>]\nLimited Ship Sales: Consolidated Outland Pioneer\n` +
    `Wave 1: <t:1764172800:T>, Wave 2: <t:1764187200:T>, Wave 3: <t:1764201600:T>, Wave 4: <t:1764216000:T>, Wave 5: <t:1764230400:T>, Wave 6: <t:1764244800:T>\n\n` +
    `**Crusader and Tumbril:**\n<t:1764259200:f> [Apex Hall <t:1764259200:R>]\n\n` +
    `**Aegis Dynamics:**\n<t:1764345600:f> [Zenith Hall <t:1764345600:R>]\nLimited Ship Sales: Idris-P, Javelin, Idris K Kit\n` +
    `Wave 1: <t:1764345600:T>, Wave 2: <t:1764360000:T>, Wave 3: <t:1764374400:T>, Wave 4: <t:1764388800:T>, Wave 5: <t:1764403200:T>, Wave 6: <t:1764417600:T>\n\n` +
    `**Best In Show:**\n<t:1764432000:f> [Zenith Hall <t:1764432000:R>]\n\n` +
    `**IAE 2955 Finale:**\n<t:1764518400:f> [Zenith Hall <t:1764518400:R>]\nEnd of IAE 2955: <t:1764777600:f>`;

  navigator.clipboard.writeText(discordSchedule).then(
    () => {
      document.getElementById("copyToDiscordBtn").innerText =
        "Copied schedule in Discord format";
    },
    err => {
      console.error("Failed to copy text: ", err);
    }
  );
}