let video = document.getElementsByTagName("video")[0];
let videoTitle;
let tStampURL;
const timeStamps = [];
let timeStampDisplay;
let tSDescription;
let choosenTab = false;
let videoCurrentTime;
let currentlyPlayingDesc = "";
let videoDuration;
let currentlyPlayingNumber = 0;
let pageLoaded = false;
console.log("coucou");

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
	try{
		let descriptionHTML = document.getElementsByTagName("yt-formatted-string").description.innerHTML;
		timeStamps.length = 0;
		await descriptionHTML.split("\n").forEach(line => {
			if (line.includes(`href="/${location.href.substring("https://www.youtube.com/".length, location.href.length)}&amp;t=`)){
				tStampURL = `${line.match(/\/watch\?v=[A-Za-z0-9-_]+&amp;t=\d+s/)[0]}`;
				tSSeconds = tStampURL.match(/t=\d+/)[0].substring(2);
				tSDisplay = secondToDHMS(tSSeconds);
				tSDescription = line.replace(/\[*<a.*<\/a>]*/, "").replace(/^[^a-zA-Z]+/,"");
				timeStamps.push({url: tStampURL, seconds: tSSeconds, display: tSDisplay, description: tSDescription});
			}
		});
	}catch(e){console.log(e)}
}

const updateTimerInfos = async () => {
	currentTime = secondToDHMS(video.currentTime);
	videoDuration = await secondToDHMS(video.duration);
	let compatibility = false;
	if (timeStamps.length != 0) {
		for (let i = 0; i < timeStamps.length; i++) {
			if (video.currentTime  < timeStamps[i].seconds) {
				currentlyPlayingDesc = timeStamps[i-1].description;
				currentlyPlayingNumber = i;
				break;
			}
		}
	}
	else{
		currentlyPlayingNumber = 0;
		currentlyPlayingDesc = "";
	}
}

const handleMessage = (request, sender, sendResponse) => {
	switch (request.message){
		case `choosingYou`:
			choosenTab = true;
		break;
		case `noMoreYou`:
			choosenTab = false;
		break;
		case `setCurrentTime`:
			video.currentTime = request.newTime;
			video.play();
		break;
		case `getTimeStamps`:
			tsInfosUpdater()
			.then(sendResponse({timeStamps: timeStamps}));
		break;
		case `getTimerInfos`:
			updateTimerInfos()
			.then(sendResponse(
				{
					videoCurrentTime: videoCurrentTime,
					videoDuration: videoDuration,
					currentlyPlayingNumber: currentlyPlayingNumber,
					currentlyPlayingDesc: currentlyPlayingDesc
				}
			));
		break;
		case `getNavInfos`:
			videoTitle = document.getElementsByTagName("H1")[0].textContent;
			sendResponse({videoTitle: videoTitle});
		break;
	}
}
tsInfosUpdater();
browser.runtime.onMessage.addListener(handleMessage);