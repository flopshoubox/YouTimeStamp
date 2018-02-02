console.log("background");

let timeStamps = [],
	activeYoutubeTabID,
	ytTabTitle,
	videoCurrentTime = 0,
	videoDuration = 0,
	compatiblePages = false;

const handleMessage = (request, sender, sendResponse) => {
	switch (request.senderScript){
		case `content`:
			switch (request.message){
				case `timeStamps`:
					timeStamps = request.timeStamps;
					ytTabTitle = request.pageTitle;
					videoDuration = request.videoDuration;
					activeYoutubeTabID = sender.tab.id;
					if (timeStamps.length > 0) {
						compatiblePages = true;
						browser.browserAction.setBadgeText({text: ":)"});
					}
					break;
				case `currentTime`:
					videoCurrentTime = request.currentTime;
				break;
			}
		break;

		case `actionPopUp`:
			switch (request.message){
				case `compatibilityCheck`:
					sendResponse({compatible: compatiblePages});
				break;
				case `getTimeStamps`:
					sendResponse({timeStamps: timeStamps, pageTitle: ytTabTitle, videoCurrentTime: videoCurrentTime  ,videoDuration: videoDuration, compatiblePages: compatiblePages});
				break;
				case `getCurrentTime`:
					sendResponse({videoCurrentTime: videoCurrentTime})
				break;
				case `setCurrentTime`:
					console.log(`Youtube tab Id : ${activeYoutubeTabID}, newTime = ${request.newTime}`);
					browser.tabs.sendMessage(activeYoutubeTabID,{message: "setCurrentTime", newTime: request.newTime});
				break;
			}
		break;
	}	
}
browser.runtime.onMessage.addListener(handleMessage);
