const schedule = [
    {
        name: "Gatac/Alien",
        timestamp: 1700236800,
        location: "Apex Hall"
    },
    {
        name: "Aegis Dynamics",
        timestamp: 1700323200,
        location: "Zenith Hall",
        limitedSales: "Idris-P, Javelin, Idris K Kit",
        waveTimestamps: [1700323200, 1700352000, 1700380800]
    },
    {
        name: "Crusader",
        timestamp: 1700409600,
        location: "Apex Hall"
    },
    {
        name: "Origin",
        timestamp: 1700496000,
        location: "Zenith Hall",
        limitedSales: "890 Jump",
        waveTimestamps: [1700496000, 1700524800, 1700553600]
    },
    {
        name: "Drake",
        timestamp: 1700582400,
        location: "Apex Hall",
        limitedSales: "Kraken, Kraken Privateer, Kraken Conversion Kit",
        waveTimestamps: [1700582400, 1700611200, 1700640000]
    },
    {
        name: "Argo/Consolidated Outland/Greycat/Kruger ",
        timestamp: 1700668800,
        location: "Zenith Hall",
        limitedSales: "Consolidated Outland Pioneer",
        waveTimestamps: [1700668800, 1700697600, 1700726400]
    },
    {
        name: "Anvil Aerospace",
        timestamp: 1700755200,
        location: "Apex Hall"
    },
    {
        name: "Misc/Mirai",
        timestamp: 1700841600,
        location: "Zenith Hall",
        limitedSales: "Misc Hull E",
        waveTimestamps: [1700841600, 1700870400, 1700899200]
    },
    {
        name: "RSI",
        timestamp: 1700928000,
        location: "Apex Hall",
        limitedSales: "Constellation Phoenix",
        waveTimestamps: [1700928000, 1700956800, 1700985600]
    },
    {
        name: "Best In Show",
        timestamp: 1701014400,
        location: "Zenith Hall"
    },
    {
        name: "IAE 2953 Finale",
        timestamp: 1701100800,
        location: "Zenith Hall",
        end: 1701374400
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
        // For events with a specific end time
        const timeUntilEnd = endTimestamp - now;
        timeLeft = calculateTimeLeft(timeUntilEnd);
        isHappening = now >= timestamp && now <= endTimestamp;
        hasPassed = now > endTimestamp;
    } else {
        // For events with the default 48 hours duration
        const timeUntilStart = timestamp - now;
        const duration = 172800; // 48 hours in seconds
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
    const now = new Date().getTime() / 1000;  // Current time in seconds

    // Function to determine the status of a wave
    function getWaveStatus(waveTimestamp, nextWaveTimestamp) {
        if (now >= waveTimestamp && (nextWaveTimestamp === undefined || now < nextWaveTimestamp)) {
            // Current time is after this wave's start but before the next wave's start
            return 'Started. Good Luck!';
        } else if (now < waveTimestamp) {
            // Current time is before this wave's start
            return 'Upcoming';
        } else {
            // Current time is after this wave's start and there's another wave that has started
            return 'Passed';
        }
    }

    // Updating the rest of the updateSchedule function to correctly apply the above logic for each wave
    // ...

    const selectedTimeZone = document.getElementById('timezone-selector').value;
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = '';

    schedule.forEach((event, index) => {
        const nextEventTimestamp = (index < schedule.length - 1) ? schedule[index + 1].timestamp : null;
        const eventTimeLeft = getTimeLeft(event.timestamp, nextEventTimestamp, event.end);

        let eventHTML = `<div class="event${eventTimeLeft.hasPassed ? ' finished-event' : ''}">`;

        if (eventTimeLeft.isHappening) {
            eventHTML = `<div class="event event-active">`;
            const endTime = event.end ? event.end : event.timestamp + 48 * 3600; // Use custom end time if available, else 48 hours after start
            const timeLeftToEnd = endTime - (new Date().getTime() / 1000); // Time left in seconds

            let timeLeftText;
            if (timeLeftToEnd > 0) {
                timeLeftText = calculateTimeLeft(timeLeftToEnd); // Calculate the formatted time left
            } else {
                timeLeftText = 'Finished'; // If the time left is negative, the event has finished
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
            eventHTML += `<div class="limited-sales">Limited Ship Sales: ${event.limitedSales}</div>`;
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
                        // Update the HTML of the previous wave to 'Passed'
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
};

function copyToDiscord() {
    const discordSchedule = `IAE 2953 Official Schedule:\n\n` +
        `**Gatac/Alien:**\n<t:1700236800:f> [Apex Hall <t:1700236800:R>]\n\n` +
        `**Aegis Dynamics:**\n<t:1700323200:f> [Zenith Hall <t:1700323200:R>]\nLimited Ship Sales: Idris-P, Javelin, Idris-K\nWave 1: <t:1700323200:T>, Wave 2: <t:1700352000:T>, Wave 3: <t:1700380800:T>\n\n` +
        `**Crusader:**\n<t:1700409600:f> [Apex Hall <t:1700409600:R>]\n\n` +
        `**Origin:**\n<t:1700496000:f> [Zenith Hall <t:1700496000:R>]\nLimited Ship Sales: 890 Jump\nWave 1: <t:1700496000:T>, Wave 2: <t:1700524800:T>, Wave 3: <t:1700553600:T>\n\n` +
        `**Drake:**\n<t:1700582400:f> [Apex Hall <t:1700582400:R>]\nLimited Ship Sales: Kraken, Kraken Privateer, Kraken Conversion Kit\nWave 1: <t:1700582400:T>, Wave 2: <t:1700611200:T>, Wave 3: <t:1700640000:T>\n\n` +
        `**Argo/Other:**\n<t:1700668800:f> [Zenith Hall <t:1700668800:R>]\nLimited Ship Sales: Consolidated Outland Pioneer\nWave 1: <t:1700668800:T>, Wave 2: <t:1700697600:T>, Wave 3: <t:1700726400:T>\n\n` +
        `**Anvil Aerospace:**\n<t:1700755200:f> [Apex Hall <t:1700755200:R>]\n\n` +
        `**Misc/Mirai:**\n<t:1700841600:f> [Zenith Hall <t:1700841600:R>]\nLimited Ship Sales: Hull E\nWave 1: <t:1700841600:T>, Wave 2: <t:1700870400:T>, Wave 3: <t:1700899200:T>\n\n` +
        `**RSI:**\n<t:1700928000:f> [Apex Hall <t:1700928000:R>]\n\n` +
        `**Best In Show:**\n<t:1701014400:f> [Zenith Hall <t:1701014400:R>]\n\n` +
        `**IAE 2953 Finale:**\n<t:1701100800:f> [Zenith Hall <t:1701100800:R>]\nEnd of IAE 2953: <t:1701374400:f> [Zenith Hall <t:1701374400:R>]`;

    navigator.clipboard.writeText(discordSchedule).then(() => {
        document.getElementById('copyToDiscordBtn').innerText = 'Copied schedule in Discord format';
    }, (err) => {
        console.error('Failed to copy text: ', err);
    });
}
