const schedule = [
    {
        name: "Crusader and Tumbril",
        timestamp: 1732291200, // November 22, 4 PM GMT
        location: "Apex Hall"
    },
    {
        name: "Aegis Dynamics",
        timestamp: 1732377600, // November 23, 4 PM GMT
        location: "Zenith Hall",
        limitedSales: "Idris-P, Javelin, Idris K Kit",
        waveTimestamps: [1732377600, 1732406400, 1732435200]
    },
    {
        name: "MISC, MIRAI",
        timestamp: 1732464000, // November 24, 4 PM GMT
        location: "Apex Hall",
        limitedSales: "Hull E",
        waveTimestamps: [1732464000, 1732492800, 1732521600] // Adjusted wave times
    },
    {
        name: "Alien Manufacturers",
        timestamp: 1732550400, // November 25, 4 PM GMT
        location: "Zenith Hall"
    },
    {
        name: "RSI",
        timestamp: 1732636800, // November 26, 4 PM GMT
        location: "Apex Hall",
        limitedSales: "Constellation Phoenix",
        waveTimestamps: [1732636800, 1732665600, 1732694400]
    },
    {
        name: "ARGO, CNOU, Greycat, Kruger",
        timestamp: 1732723200, // November 27, 4 PM GMT
        location: "Zenith Hall",
        limitedSales: "Consolidated Outland Pioneer",
        waveTimestamps: [1732723200, 1732752000, 1732780800]
    },
    {
        name: "Drake",
        timestamp: 1732809600, // November 28, 4 PM GMT
        location: "Apex Hall",
        limitedSales: "Kraken, Kraken Privateer, Kraken Conversion Kit",
        waveTimestamps: [1732809600, 1732838400, 1732867200]
    },
    {
        name: "Origin",
        timestamp: 1732896000, // November 29, 4 PM GMT
        location: "Zenith Hall",
        limitedSales: "890 Jump",
        waveTimestamps: [1732896000, 1732924800, 1732953600] // Adjusted wave times
    },
    {
        name: "Anvil Aerospace",
        timestamp: 1732982400, // November 30, 4 PM GMT
        location: "Apex Hall"
    },
    {
        name: "Best In Show",
        timestamp: 1733068800, // December 1, 4 PM GMT
        location: "Zenith Hall"
    },
    {
        name: "IAE 2954 Finale",
        timestamp: 1733155200, // December 2, 4 PM GMT
        location: "Zenith Hall",
        end: 1733366400 // December 5, 4 PM GMT
    }
];

function populateTimeZones() {
    const timeZones = Intl.supportedValuesOf('timeZone');
    const selector = document.getElementById('timezone-selector');
    timeZones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone;
        option.textContent = zone;
        selector.appendChild(option);
    });
    selector.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('timezone-info').textContent = `Your timezone is ${selector.value} and the schedule is based on that.`;
}

function convertTimestampToLocaleString(timestamp, timeZone) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', { timeZone, hour12: true });
}

function getTimeLeft(timestamp, nextTimestamp, endTimestamp) {
    const now = new Date().getTime() / 1000;
    let timeLeft, isHappening, hasPassed;

    if (endTimestamp) {
        const timeUntilEnd = endTimestamp - now;
        timeLeft = calculateTimeLeft(timeUntilEnd);
        isHappening = now >= timestamp && now <= endTimestamp;
        hasPassed = now > endTimestamp;
    } else {
        const timeUntilStart = timestamp - now;
        const duration = 172800;
        timeLeft = calculateTimeLeft(timeUntilStart);
        isHappening = timeUntilStart <= 0 && timeUntilStart > -duration;
        hasPassed = timeUntilStart <= -duration;
    }

    return { text: timeLeft, isHappening: isHappening, hasPassed: hasPassed };
}

function calculateTimeLeft(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = Math.floor(seconds % 60);

    let timeLeftText;
    if (days > 0) {
        timeLeftText = `${days}d:${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m`;
    } else {
        timeLeftText = `${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${secondsLeft.toString().padStart(2, '0')}s`;
    }
    return timeLeftText;
}

function updateSchedule() {
    const now = new Date().getTime() / 1000;

    function getWaveStatus(waveTimestamp, nextWaveTimestamp) {
        if (now >= waveTimestamp && (nextWaveTimestamp === undefined || now < nextWaveTimestamp)) {
            return 'Started. Good Luck!';
        } else if (now < waveTimestamp) {
            return 'Upcoming';
        } else {
            return 'Passed';
        }
    }

    const shipLinks = {
        'Idris-P': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=idris&sort=weight&direction=desc',
        'Javelin': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=javelin&sort=weight&direction=desc',
        'Idris K Kit': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=Idris+P+After+Market+Kit&sort=weight&direction=desc',
        '890 Jump': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=890&sort=weight&direction=desc',
        'Constellation Phoenix': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=phoenix&sort=weight&direction=desc',
        'Kraken': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken&sort=weight&direction=desc',
        'Kraken Conversion Kit': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken+conversion&sort=weight&direction=desc',
        'Kraken Privateer': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=kraken+privateer&sort=weight&direction=desc',
        'Hull E': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=hull+e&sort=weight&direction=desc',
        'Consolidated Outland Pioneer': 'https://robertsspaceindustries.com/store/pledge/browse/extras/?search=pioneer&sort=weight&direction=desc'
    };

    const selectedTimeZone = document.getElementById('timezone-selector').value;
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = '';

    schedule.forEach((event, index) => {
        const nextEventTimestamp = (index < schedule.length - 1) ? schedule[index + 1].timestamp : null;
        const eventTimeLeft = getTimeLeft(event.timestamp, nextEventTimestamp, event.end);

        let eventHTML = `<div class="event${eventTimeLeft.hasPassed ? ' finished-event' : ''}">`;

        if (eventTimeLeft.isHappening) {
            eventHTML = `<div class="event event-active">`;
            const endTime = event.end ? event.end : event.timestamp + 48 * 3600;
            const timeLeftToEnd = endTime - (new Date().getTime() / 1000);

            let timeLeftText;
            if (timeLeftToEnd > 0) {
                timeLeftText = calculateTimeLeft(timeLeftToEnd);
            } else {
                timeLeftText = 'Finished';
            }

            eventHTML += `<div class="event-name happening-now">${event.name} - Happening Now in ${event.location}<span class="time-left">${timeLeftText}</span></div>`;
        } else if (eventTimeLeft.hasPassed) {
            eventHTML += `<div class="event-name finished">${event.name} - Finished</div>`;
        } else {
            const diffInSeconds = event.timestamp - (new Date().getTime() / 1000);
            if (diffInSeconds > 0 && diffInSeconds <= 86400) {
                eventHTML += `<div class="event-name">${event.name}</div>
                          <div class="location">Event starting soon in: ${eventTimeLeft.text} at ${convertTimestampToLocaleString(event.timestamp, selectedTimeZone)} [${event.location}]</div>`;
            } else {
                eventHTML += `<div class="event-name">${event.name}</div>
                          <div class="location">${convertTimestampToLocaleString(event.timestamp, selectedTimeZone)} [${event.location}]</div>`;
            }
        }

        if (event.limitedSales) {
            let limitedSalesLinks = '';
            const sales = event.limitedSales.split(', ');
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
            let lastWaveStatus = '';
            event.waveTimestamps.forEach((waveTimestamp, waveIndex) => {
                const nextWaveTimestamp = (waveIndex < event.waveTimestamps.length - 1) ?
                    event.waveTimestamps[waveIndex + 1] :
                    (nextEventTimestamp ? nextEventTimestamp : Number.MAX_SAFE_INTEGER);
                const waveTimeLeft = getTimeLeft(waveTimestamp, nextWaveTimestamp);

                let waveStatus;
                if (waveTimeLeft.isHappening) {
                    waveStatus = `Wave ${waveIndex + 1}: <span class="wave-happening-now">Started. Good Luck!</span>`;
                    if (lastWaveStatus === 'Happening') {
                        eventHTML = eventHTML.replace(`Wave ${waveIndex}: <span class="wave-happening-now">Started. Good Luck!</span>`, `Wave ${waveIndex}: <span class="finished-wave">Passed</span>`);
                    }
                    lastWaveStatus = 'Happening';
                } else if (waveTimeLeft.hasPassed) {
                    waveStatus = `Wave ${waveIndex + 1}: <span class="finished-wave">Passed</span>`;
                    lastWaveStatus = 'Passed';
                } else {
                    waveStatus = `Wave ${waveIndex + 1}: ${waveTimeLeft.text}`;
                    lastWaveStatus = 'Upcoming';
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
    if (urlParams.get('action') === 'copyToDiscord') {
      copyToDiscord();
    }
};

function copyToDiscord() {
    const discordSchedule = `IAE 2954 Official Schedule:\n\n` +
        `**Crusader and Tumbril:**\n<t:1732291200:f> [Apex Hall <t:1732291200:R>]\n\n` +
        `**Aegis Dynamics:**\n<t:1732377600:f> [Zenith Hall <t:1732377600:R>]\nLimited Ship Sales: Idris-P, Javelin, Idris K Kit\nWave 1: <t:1732377600:T>, Wave 2: <t:1732406400:T>, Wave 3: <t:1732435200:T>\n\n` +
        `**MISC, MIRAI:**\n<t:1732464000:f> [Apex Hall <t:1732464000:R>]\nLimited Ship Sales: Hull E\nWave 1: <t:1732464000:T>, Wave 2: <t:1732492800:T>, Wave 3: <t:1732521600:T>\n\n` +
        `**Alien Manufacturers:**\n<t:1732550400:f> [Zenith Hall <t:1732550400:R>]\n\n` +
        `**RSI:**\n<t:1732636800:f> [Apex Hall <t:1732636800:R>]\nLimited Ship Sales: Constellation Phoenix\nWave 1: <t:1732636800:T>, Wave 2: <t:1732665600:T>, Wave 3: <t:1732694400:T>\n\n` +
        `**ARGO, CNOU, Greycat, Kruger:**\n<t:1732723200:f> [Zenith Hall <t:1732723200:R>]\nLimited Ship Sales: Consolidated Outland Pioneer\nWave 1: <t:1732723200:T>, Wave 2: <t:1732752000:T>, Wave 3: <t:1732780800:T>\n\n` +
        `**Drake:**\n<t:1732809600:f> [Apex Hall <t:1732809600:R>]\nLimited Ship Sales: Kraken, Kraken Privateer, Kraken Conversion Kit\nWave 1: <t:1732809600:T>, Wave 2: <t:1732838400:T>, Wave 3: <t:1732867200:T>\n\n` +
        `**Origin:**\n<t:1732896000:f> [Zenith Hall <t:1732896000:R>]\nLimited Ship Sales: 890 Jump\nWave 1: <t:1732896000:T>, Wave 2: <t:1732924800:T>, Wave 3: <t:1732953600:T>\n\n` +
        `**Anvil Aerospace:**\n<t:1732982400:f> [Apex Hall <t:1732982400:R>]\n\n` +
        `**Best In Show:**\n<t:1733068800:f> [Zenith Hall <t:1733068800:R>]\n\n` +
        `**IAE 2954 Finale:**\n<t:1733155200:f> [Zenith Hall <t:1733155200:R>]\nEnd of IAE 2954: <t:1733366400:f> [Zenith Hall <t:1733366400:R>]`;

    navigator.clipboard.writeText(discordSchedule).then(() => {
        document.getElementById('copyToDiscordBtn').innerText = 'Copied schedule in Discord format';
    }, (err) => {
        console.error('Failed to copy text: ', err);
    });
}
