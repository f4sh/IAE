const DAY_SECONDS = 24 * 60 * 60;
const WAVE_INTERVAL_SECONDS = 4 * 60 * 60;

const scheduleConfig = {
  title: "IAE 2956",
  startTimestamp: Date.UTC(2026, 10, 13, 16) / 1000,
  location: "Tobin Expo Center",
  events: [
    { name: "RSI", days: 1, limitedSales: "Constellation Phoenix" },
    { name: "Origin", days: 1, limitedSales: "890 Jump" },
    { name: "Anvil Aerospace", days: 1 },
    { name: "Crusader and Tumbril", days: 1 },
    { name: "Drake", days: 1, limitedSales: "Kraken, Kraken Privateer, Kraken Conversion Kit" },
    { name: "ARGO, CNOU, Greycat", days: 1, limitedSales: "Consolidated Outland Pioneer" },
    { name: "MISC, MIRAI, Kruger", days: 1, limitedSales: "Hull E" },
    { name: "Aegis Dynamics", days: 1, limitedSales: "Idris-P, Javelin, Idris K Kit" },
    { name: "Alien Manufacturers", days: 1 },
    { name: "Best In Show", days: 1 },
    { name: "IAE 2956 Finale", days: 4, endLabel: "End of IAE 2956" }
  ]
};

const accentColor = "#FFB648";

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

let nextTimestamp = scheduleConfig.startTimestamp;
const schedule = scheduleConfig.events.map(({ days = 1, ...event }) => {
  const timestamp = nextTimestamp;
  const end = timestamp + days * DAY_SECONDS;
  nextTimestamp = end;

  return {
    ...event,
    timestamp,
    end,
    location: event.location ?? scheduleConfig.location,
    ...(event.limitedSales && {
      waveTimestamps: Array.from(
        { length: 6 },
        (_, index) => timestamp + index * WAVE_INTERVAL_SECONDS
      )
    })
  };
});

function populateTimeZones() {
  const selector = document.getElementById("timezone-selector");

  let timeZones;
  if (Intl.supportedValuesOf) {
    timeZones = Intl.supportedValuesOf("timeZone");
  } else {
    // basic fallback if supportedValuesOf is not available
    timeZones = [
      "UTC",
      "America/Vancouver",
      "America/New_York",
      "Europe/London",
      "Europe/Warsaw",
      "Asia/Tokyo"
    ];
  }

  timeZones.forEach(zone => {
    const option = document.createElement("option");
    option.value = zone;
    option.textContent = zone;
    selector.appendChild(option);
  });

  const resolved = (Intl.DateTimeFormat().resolvedOptions().timeZone) || "UTC";
  selector.value = timeZones.includes(resolved) ? resolved : "UTC";

  document.getElementById("timezone-info").textContent =
    `Your timezone is ${selector.value} and the schedule is based on that.`;

  selector.addEventListener("change", () => updateSchedule());
}

function convertTimestampToLocaleString(timestamp, timeZone) {
  const date = new Date(timestamp * 1000);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).formatToParts(date);
  const getPart = type => parts.find(part => part.type === type).value;

  return `${getPart("day")} ${getPart("month")} ${getPart("year")}, ${getPart("hour")}:${getPart("minute")} ${getPart("dayPeriod")}`;
}

function getTimeLeft(timestamp, nextTimestamp, endTimestamp, now) {
  let timeLeft;
  let isHappening;
  let hasPassed;

  if (endTimestamp) {
    const timeUntilEnd = endTimestamp - now;
    timeLeft = calculateTimeLeft(timeUntilEnd);
    isHappening = now >= timestamp && now < endTimestamp;
    hasPassed = now >= endTimestamp;
  } else {
    const duration = nextTimestamp ? (nextTimestamp - timestamp) : 86400;
    const timeUntilStart = timestamp - now;
    timeLeft = calculateTimeLeft(timeUntilStart);
    isHappening = timeUntilStart <= 0 && timeUntilStart > -duration;
    hasPassed = timeUntilStart <= -duration;
  }

  return { text: timeLeft, isHappening, hasPassed };
}

function getSchedulePhase(now) {
  return schedule.map(event => {
    if (now >= event.end) return "finished";
    if (now >= event.timestamp) return "active";
    if (event.timestamp - now <= DAY_SECONDS) return "starting";
    return "upcoming";
  }).join("|");
}

let renderedSchedulePhase;

function calculateTimeLeft(seconds) {
  if (!Number.isFinite(seconds)) return "00h:00m:00s";

  const safeSeconds = Math.max(0, seconds);

  const days = Math.floor(safeSeconds / (3600 * 24));
  const hours = Math.floor((safeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secondsLeft = Math.floor(safeSeconds % 60);

  if (days > 0) {
    return `${days}d:${hours.toString().padStart(2, "0")}h:${minutes
      .toString()
      .padStart(2, "0")}m`;
  }

  return `${hours.toString().padStart(2, "0")}h:${minutes
    .toString()
    .padStart(2, "0")}m:${secondsLeft.toString().padStart(2, "0")}s`;
}

function updateSchedule(now = Date.now() / 1000) {
  const selectedTimeZone = document.getElementById("timezone-selector").value;
  const scheduleContainer = document.getElementById("schedule");
  scheduleContainer.innerHTML = "";

  schedule.forEach((event, index) => {
    const nextEventTimestamp =
      index < schedule.length - 1 ? schedule[index + 1].timestamp : null;
    const eventTimeLeft = getTimeLeft(
      event.timestamp,
      nextEventTimestamp,
      event.end,
      now
    );

    let eventHTML = `<div class="event${
      eventTimeLeft.hasPassed ? " finished-event" : ""
    }">`;

    if (eventTimeLeft.isHappening) {
      eventHTML = `<div class="event event-active" aria-live="polite">`;
      const endTime = event.end ? event.end : event.timestamp + 24 * 3600;

      eventHTML += `<div class="event-name happening-now">${
        event.name
      } - Happening Now in ${
        event.location
      }<span class="time-left" data-countdown-to="${endTime}"></span></div>`;
    } else if (eventTimeLeft.hasPassed) {
      eventHTML += `<div class="event-name finished">${event.name} - Finished</div>`;
    } else {
      const diffInSeconds = event.timestamp - now;
      if (diffInSeconds > 0 && diffInSeconds <= 86400) {
        eventHTML += `<div class="event-name">${event.name}</div>
          <div class="location">Event starting soon in: <span data-countdown-to="${event.timestamp}"></span> at ${convertTimestampToLocaleString(
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
      const limitedSalesLinks = event.limitedSales.split(", ").map(sale => {
        const link = shipLinks[sale.trim()];
        if (link) {
          return `<a href="${link}" class="limited-sales-link" target="_blank">${sale}</a>`;
        }
        return `<span class="limited-sales-item">${sale}</span>`;
      }).join(", ");

      eventHTML += `<div class="limited-sales"><span class="limited-sales-label">Limited Ship Sales:</span> ${limitedSalesLinks}</div>`;

      event.waveTimestamps.forEach((waveTimestamp, waveIndex) => {
        const nextWaveTimestamp =
          waveIndex < event.waveTimestamps.length - 1
            ? event.waveTimestamps[waveIndex + 1]
            : waveTimestamp + 4 * 3600; // last wave = 4h window

        eventHTML += `<div class="wave" data-countdown-to="${waveTimestamp}" data-countdown-end="${nextWaveTimestamp}" data-wave-number="${waveIndex + 1}"></div>`;
      });
    }

    eventHTML += `</div>`;
    scheduleContainer.innerHTML += eventHTML;
  });

  renderedSchedulePhase = getSchedulePhase(now);
  updateCountdowns(now);
}

function updateCountdowns(now = Date.now() / 1000) {
  const phase = getSchedulePhase(now);
  if (phase !== renderedSchedulePhase) {
    updateSchedule(now);
    return;
  }

  document.querySelectorAll("[data-countdown-to]").forEach(element => {
    const target = Number(element.dataset.countdownTo);
    const waveNumber = element.dataset.waveNumber;

    if (waveNumber !== undefined) {
      const end = Number(element.dataset.countdownEnd);
      if (now >= end) {
        element.innerHTML = `Wave ${waveNumber}: <span class="finished-wave">Passed</span>`;
      } else if (now >= target) {
        element.innerHTML = `Wave ${waveNumber}: <span class="wave-happening-now">Started. Good Luck!</span>`;
      } else {
        element.textContent = `Wave ${waveNumber}: ${calculateTimeLeft(target - now)}`;
      }
    } else {
      element.textContent = calculateTimeLeft(target - now);
    }
  });
}

window.onload = () => {
  document.documentElement.style.setProperty("--accent-color", accentColor);
  populateTimeZones();
  const scheduleContainer = document.getElementById("schedule");
  if (scheduleContainer) {
    scheduleContainer.setAttribute("aria-live", "polite");
  }

  updateSchedule();
  setInterval(updateCountdowns, 1000);

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("action") === "copyToDiscord") {
    copyToDiscord();
  }
};

function copyToDiscord() {
  const discordSchedule = [
    `${scheduleConfig.title} Official Schedule:`,
    ...schedule.map(event => {
      const lines = [
        `**${event.name}:** <t:${event.timestamp}:f> in <t:${event.timestamp}:R>`
      ];

      if (event.limitedSales) {
        lines.push(`Limited Ship Sales: ${event.limitedSales}`);
        lines.push(
          ...event.waveTimestamps.map(
            (timestamp, index) => `Wave ${index + 1}: <t:${timestamp}:T>`
          )
        );
      }

      if (event.endLabel) {
        lines.push(`${event.endLabel}: <t:${event.end}:f>`);
      }

      return lines.join("\n");
    })
  ].join("\n\n");

  const copyButton = document.getElementById("copyToDiscordBtn");
  if (discordSchedule.length > 2000) {
    copyButton.innerText = `Schedule exceeds Discord's 2000-character limit (${discordSchedule.length}).`;
    return;
  }

  navigator.clipboard.writeText(discordSchedule).then(
    () => {
      copyButton.innerText = "Copied schedule in Discord format";
    },
    err => {
      console.error("Failed to copy text: ", err);
    }
  );
}