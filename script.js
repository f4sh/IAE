const schedule = [
    {
        name: "Crusader and Tumbril",
        timestamp: 1732291200, // November 22, 4 PM GMT
        location: "Apex Hall",
        image: "img/2954_crusader.png"
    },
    {
        name: "Aegis Dynamics",
        timestamp: 1732377600, // November 23, 4 PM GMT
        location: "Zenith Hall",
        limitedSales: "Idris-P, Javelin, Idris K Kit",
        waveTimestamps: [1732377600, 1732406400, 1732435200],
        image: "img/2954_aegis.png"
    },
    {
        name: "MISC, MIRAI",
        timestamp: 1732464000, // November 24, 4 PM GMT
        location: "Apex Hall",
        limitedSales: "Hull E",
        waveTimestamps: [1732464000, 1732492800, 1732521600],
        image: "img/2954_mirai.png"
    },
    {
        name: "Alien Manufacturers",
        timestamp: 1732550400, // November 25, 4 PM GMT
        location: "Zenith Hall",
        image: "img/2954_alien.png"
    },
    {
        name: "RSI",
        timestamp: 1732636800, // November 26, 4 PM GMT
        location: "Apex Hall",
        limitedSales: "Constellation Phoenix",
        waveTimestamps: [1732636800, 1732665600, 1732694400],
        image: "img/2954_rsi.png"
    },
    {
        name: "ARGO, CNOU, Greycat, Kruger",
        timestamp: 1732723200, // November 27, 4 PM GMT
        location: "Zenith Hall",
        limitedSales: "Consolidated Outland Pioneer",
        waveTimestamps: [1732723200, 1732752000, 1732780800],
        image: "img/2954_cnou.png"
        
    },
    {
        name: "Drake",
        timestamp: 1732809600, // November 28, 4 PM GMT
        location: "Apex Hall",
        limitedSales: "Kraken, Kraken Privateer, Kraken Conversion Kit",
        waveTimestamps: [1732809600, 1732838400, 1732867200],
        image: "img/2954_drake.png"
    },
    {
        name: "Origin",
        timestamp: 1732896000, // November 29, 4 PM GMT
        location: "Zenith Hall",
        limitedSales: "890 Jump",
        waveTimestamps: [1732896000, 1732924800, 1732953600],
        image: "img/2954_origin.png"
    },
    {
        name: "Anvil Aerospace",
        timestamp: 1732982400, // November 30, 4 PM GMT
        location: "Apex Hall",
        image: "img/2954_anvil.png"
    },
    {
        name: "Best In Show",
        timestamp: 1733068800, // December 1, 4 PM GMT
        location: "Zenith Hall",
        image: "img/2954_bis.png"
    },
    {
        name: "IAE 2954 Finale",
        timestamp: 1733155200, // December 2, 4 PM GMT
        location: "Zenith Hall",
        end: 1733366400, // December 5, 4 PM GMT
        image: "img/2954_finale.png"
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

    schedule.forEach((event, index) => {
        const eventId = `event-${index}`;
        let eventElement = document.getElementById(eventId);

        const nextEventTimestamp = (index < schedule.length - 1) ? schedule[index + 1].timestamp : null;
        const eventTimeLeft = getTimeLeft(event.timestamp, nextEventTimestamp, event.end);

        if (!eventElement) {
            eventElement = document.createElement('div');
            eventElement.id = eventId;
            eventElement.classList.add('event');

            const imgElement = document.createElement('img');
            imgElement.src = event.image;
            imgElement.alt = event.name;
            imgElement.classList.add('event-logo');
            eventElement.appendChild(imgElement);

            const titleElement = document.createElement('div');
            titleElement.classList.add('event-title');
            titleElement.textContent = `${event.name} - ${event.location}`;
            eventElement.appendChild(titleElement);

            const timeLeftElement = document.createElement('div');
            timeLeftElement.classList.add('time-left');
            timeLeftElement.id = `time-left-${index}`;
            eventElement.appendChild(timeLeftElement);

            if (event.limitedSales) {
                const salesElement = document.createElement('div');
                salesElement.classList.add('limited-sales');
                const salesText = event.limitedSales.split(', ').map(sale => {
                    const link = shipLinks[sale.trim()];
                    return link ? `<a href="${link}" target="_blank">${sale}</a>` : sale;
                }).join(', ');
                salesElement.innerHTML = `Limited Ship Sales: ${salesText}`;
                eventElement.appendChild(salesElement);
            }

            scheduleContainer.appendChild(eventElement);
        }

        const timeLeftElement = document.getElementById(`time-left-${index}`);
        let timeLeftText;

        if (eventTimeLeft.isHappening) {
            const endTime = event.end ? event.end : event.timestamp + 48 * 3600;
            timeLeftText = endTime - now > 0 ? `Ends in ${calculateTimeLeft(endTime - now)}` : 'Finished';
        } else if (eventTimeLeft.hasPassed) {
            timeLeftText = 'Event has ended';
        } else {
            timeLeftText = `Starts in ${eventTimeLeft.text}`;
        }

        if (timeLeftElement.textContent !== timeLeftText) {
            timeLeftElement.textContent = timeLeftText;
        }
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
        `**Aegis Dynamics:**\n<t:1732377600:f> [Zenith Hall <t:1732377600:R>]\nLimited Ship Sales: Idris-P, Javelin, Idris-K\nWave 1: <t:1732377600:T>, Wave 2: <t:1732406400:T>, Wave 3: <t:1732435200:T>\n\n` +
        `**Gatac/Alien Manufacturers:**\n<t:1732464000:f> [Apex Hall <t:1732464000:R>]\n\n` +
        `**Origin:**\n<t:1732550400:f> [Zenith Hall <t:1732550400:R>]\nLimited Ship Sales: 890 Jump\nWave 1: <t:1732550400:T>, Wave 2: <t:1732579200:T>, Wave 3: <t:1732608000:T>\n\n` +
        `**RSI:**\n<t:1732636800:f> [Apex Hall <t:1732636800:R>]\nLimited Ship Sales: Constellation Phoenix\nWave 1: <t:1732636800:T>, Wave 2: <t:1732665600:T>, Wave 3: <t:1732694400:T>\n\n` +
        `**ARGO, CNOU, Greycat, Kruger:**\n<t:1732723200:f> [Zenith Hall <t:1732723200:R>]\nLimited Ship Sales: Consolidated Outland Pioneer\nWave 1: <t:1732723200:T>, Wave 2: <t:1732752000:T>, Wave 3: <t:1732780800:T>\n\n` +
        `**Drake:**\n<t:1732809600:f> [Apex Hall <t:1732809600:R>]\nLimited Ship Sales: Kraken, Kraken Privateer, Kraken Conversion Kit\nWave 1: <t:1732809600:T>, Wave 2: <t:1732838400:T>, Wave 3: <t:1732867200:T>\n\n` +
        `**MISC, MIRAI:**\n<t:1732896000:f> [Zenith Hall <t:1732896000:R>]\nLimited Ship Sales: Hull E\nWave 1: <t:1732896000:T>, Wave 2: <t:1732924800:T>, Wave 3: <t:1732953600:T>\n\n` +
        `**Anvil Aerospace:**\n<t:1732982400:f> [Apex Hall <t:1732982400:R>]\n\n` +
        `**Best In Show:**\n<t:1733068800:f> [Zenith Hall <t:1733068800:R>]\n\n` +
        `**IAE 2954 Finale:**\n<t:1733155200:f> [Zenith Hall <t:1733155200:R>]\nEnd of IAE 2954: <t:1733366400:f> [Zenith Hall <t:1733366400:R>]`;

    navigator.clipboard.writeText(discordSchedule).then(() => {
        document.getElementById('copyToDiscordBtn').innerText = 'Copied schedule in Discord format';
    }, (err) => {
        console.error('Failed to copy text: ', err);
    });
}
