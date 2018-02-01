let timestampsText;
window.alert("toto");

const secondToDHMS = (seconds) => {
	let tsDay = Math.floor(seconds/86400);
	let tsHour = Math.floor((seconds - (tsDay * 86400)) / 3600);
	let tsMin = Math.floor((seconds - (tsDay * 86400) - (tsHour * 3600)) / 60);
	let tsSec = Math.floor(seconds - (tsDay * 86400) - (tsHour * 3600) - (tsMin * 60));

	let timeStampDisplay = "";
	if (tsDay > 0) {
		if (tsDay < 10) {
			timeStampDisplay += "0";
		}
		timeStampDisplay += `${tsDay}:`;
		if (tsDay == 0) {
			timeStampDisplay += "00";
		}
	}
	if (tsHour > 0) {
		if (tsHour < 10) {
			timeStampDisplay += "0";
		}
		timeStampDisplay += `${tsHour}:`;
	}

	if (tsMin < 10) {
		timeStampDisplay += "0";
	}
	timeStampDisplay += `${tsMin}:`;

	if (tsSec < 10) {
		timeStampDisplay += "0";
	}
	timeStampDisplay += `${tsSec}`;
	return timeStampDisplay;
}

const timeStampsGetter = async () => {
	let descriptionHTML = document.getElementById("description").innerHTML,
		timestamps = [];
	await descriptionHTML.split("\n").forEach(line => {
		if (line.includes(`href="/${location.href.substring("https://www.youtube.com/".length, location.href.length)}&amp;t=`)){
			let tStampURL = `https://www.youtube.com${line.match(/\/watch\?v=[A-Za-z0-9-_]+&amp;t=\d+s/)[0]}`;
			let timeStampDisplay = secondToDHMS(tStampURL.match(/t=\d+/)[0].substring(2));
			let tSDescription = line.replace(/<a.*<\/a>/, "").replace(/^[^a-zA-Z]+/,"");
			timestamps.push({url: tStampURL, display: timeStampDisplay, description: tSDescription});
		}
	});

	console.log(timestamps);
	await browser.runtime.sendMessage({message: timestamps, senderScript: content});
}

const handlePageLoaded = async () => {
	await timeStampsGetter();
}
window.onload = handlePageLoaded();
