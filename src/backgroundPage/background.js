console.log("background");

let timeStamps,
	activeYoutubeTabID,
	pageTitle,
	videoCurrentTime,
	currentlyPlayingDesc,
	videoDuration,
	compatiblePages,
	hasSelectedPage,
	currentlyPlayingNumber;



const initVar = () => {
	timeStamps = [],
	activeYoutubeTabID = -1,
	pageTitle = "",
	videoCurrentTime = 0,
	currentlyPlayingDesc = "",
	videoDuration = 0,
	compatiblePages = false,
	hasSelectedPage = false;
	currentlyPlayingNumber = 0;

}
initVar();
const handleUpdated = (tabId, changeInfo, tabInfo) => {
	if (changeInfo.url) {
		if (tabInfo.url.match(/https:\/\/www\.youtube\.com\/watch\?v=/)) {
			browser.pageAction.show(tabId);
			if (activeYoutubeTabID == tabId) {
				browser.pageAction.setIcon({tabId: tabId, path: "../pageAction/playNav-blue.png"});
				browser.tabs.sendMessage(activeYoutubeTabID,{message: "newInfos"});
			}
		}
		else{
			if(activeYoutubeTabID == tabId){
				browser.tabs.sendMessage(activeYoutubeTabID,{message: "noMoreYou"});
				browser.browserAction.setBadgeText({text: ""});
				initVar();
			}
		}
	}
}
// 
const handlePageActionClick = (tab) => {
	if (activeYoutubeTabID != tab.id) {
		browser.tabs.sendMessage(tab.id,{message: "choosingYou"});
		browser.pageAction.setIcon({tabId: tab.id, path: "../pageAction/playNav-blue.png"});
		browser.tabs.sendMessage(activeYoutubeTabID,{message: "noMoreYou"});
		browser.pageAction.setIcon({tabId: activeYoutubeTabID, path: "../pageAction/playNav-grey.png"});
		activeYoutubeTabID = tab.id;
		hasSelectedPage = true;
	}
	else{
		browser.tabs.sendMessage(activeYoutubeTabID,{message: "noMoreYou"});
		browser.pageAction.setIcon({tabId: activeYoutubeTabID, path: "../pageAction/playNav-grey.png"});
		initVar();
	}
	
	//changing icon and favicon
}



const handleMessage = (request, sender, sendResponse) => {
	switch (request.senderScript){
		case `content`:
			switch (request.message){
				case `timeStamps`:
					timeStamps = request.timeStamps;
					pageTitle = request.pageTitle;
					activeYoutubeTabID = sender.tab.id;
					if (timeStamps.length > 0) {
						compatiblePages = true;
						browser.browserAction.setBadgeText({text: ":)"});
					}
				break;
				case `currentTime`:
					videoCurrentTime = request.currentTime;
				break;
				case `currentlyPlaying`:
					currentlyPlayingDesc = request.currentlyPlayingDesc;
					currentlyPlayingNumber = request.currentlyPlayingNumber;
					videoDuration = request.videoDuration;
					pageTitle = request.pageTitle;
				break;
			}
		break;

		case `actionPopUp`:
			switch (request.message){
				case `compatibilityCheck`:
					sendResponse({compatible: compatiblePages, hasSelectedPage: hasSelectedPage});
				break;
				case `getTimeStamps`:
					browser.tabs.sendMessage(activeYoutubeTabID, {message: "getInfos"})
					.then(sendResponse({timeStamps: timeStamps, pageTitle: pageTitle, compatiblePages: compatiblePages}));
				
				break;
				case `getCurrentState`:
					sendResponse({videoCurrentTime: videoCurrentTime, videoDuration: videoDuration, currentlyPlayingDesc: currentlyPlayingDesc, currentlyPlayingNumber: currentlyPlayingNumber, pageTitle: pageTitle})
				break;
				case `setCurrentTime`:
					browser.tabs.sendMessage(activeYoutubeTabID,{message: "setCurrentTime", newTime: request.newTime});
				break;
			}
		break;
	}	
}

browser.runtime.onMessage.addListener(handleMessage);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.pageAction.onClicked.addListener(handlePageActionClick);
