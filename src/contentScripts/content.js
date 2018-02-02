let video = document.getElementsByTagName("video")[0];
let tsPageTitle;
let tStampURL;
const timeStamps = [];
let timeStampDisplay;
let tSDescription;
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

const tsInfosUpdater = async () => {
	let descriptionHTML = document.getElementById("description").innerHTML;
	await descriptionHTML.split("\n").forEach(line => {
		if (line.includes(`href="/${location.href.substring("https://www.youtube.com/".length, location.href.length)}&amp;t=`)){
			tStampURL = `${line.match(/\/watch\?v=[A-Za-z0-9-_]+&amp;t=\d+s/)[0]}`;
			timeStampDisplay = secondToDHMS(tStampURL.match(/t=\d+/)[0].substring(2));
			tSDescription = line.replace(/\[*<a.*<\/a>]*/, "").replace(/^[^a-zA-Z]+/,"");
			timeStamps.push({url: tStampURL, display: timeStampDisplay, description: tSDescription});
		}
	});
}

const handlePageLoaded = async () => {
	tsPageTitle = document.getElementsByTagName("H1")[0].innerHTML;
	let tsVideoDuration = secondToDHMS(video.duration);
	await tsInfosUpdater()
	.then(() => {
		browser.runtime.sendMessage({message: "timeStamps", senderScript: "content",  timeStamps: timeStamps, pageTitle: tsPageTitle, videoDuration: tsVideoDuration})
	});
}

const timeUpdated = async () => {
	let currentTime = secondToDHMS(video.currentTime);
	browser.runtime.sendMessage({message: "currentTime", senderScript: "content", currentTime: currentTime});
	console.log("sending curentTime");
}

const handleMessage = (request, sender, sendResponse) => {
	switch (request.message){
		case `setCurrentTime`:
			video.currentTime = request.newTime;
		break;
	}
}
video.addEventListener("timeupdate", timeUpdated);
window.onload = handlePageLoaded();
browser.runtime.onMessage.addListener(handleMessage);