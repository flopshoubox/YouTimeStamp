console.log("background");

let timeStamps = [],
	activeYoutubeTabID,
	ytTabTitle,
	videoCurrentTime = 0,
	videoDuration = 0;
const handleMessage = (request, sender, sendResponse) => {
	switch (request.senderScript){
		case `content`:
			switch (request.message){
				case `timeStamps`:
					timeStamps = request.timeStamps;
					ytTabTitle = request.pageTitle;
					videoDuration = request.videoDuration;
					activeYoutubeTabID = sender.tab.id;

				break;
				case `currentTime`:
					videoCurrentTime = request.currentTime;
					console.log(`videoCurrentTime = ${videoCurrentTime}`);
				break;
			}
		break;
		case `actionPopUp`:
			switch (request.message){
				case `getTimeStamps`:
					sendResponse({timeStamps: timeStamps, pageTitle: ytTabTitle, videoCurrentTime: videoCurrentTime  ,videoDuration: videoDuration});
				break;
				case `getCurrentTime`:
					sendResponse({videoCurrentTime: videoCurrentTime})
				break;
			}
		break;
	}	
}
browser.runtime.onMessage.addListener(handleMessage);
