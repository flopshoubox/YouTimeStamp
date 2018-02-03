console.log("background");

let timeStamps,
	activeYoutubeTabID,
	ytTabTitle,
	videoCurrentTime,
	videoDuration,
	compatiblePages,
	hasSelectedPage;


const initVar = () => {
	timeStamps = [],
	activeYoutubeTabID = -1,
	ytTabTitle = "",
	videoCurrentTime = 0,
	videoDuration = 0,
	compatiblePages = false,
	hasSelectedPage = false;
}
initVar();
const handleUpdated = (tabId, changeInfo, tabInfo) => {
	if (changeInfo.url) {
		console.log("url has changed");
		if (tabInfo.url.match(/https:\/\/www\.youtube\.com\/watch\?v=/)) {
			browser.pageAction.show(tabId);
			if (activeYoutubeTabID == tabId) {
				browser.pageAction.setIcon({tabId: tabId, path: "../pageAction/playNav-blue.png"});
				browser.tabs.sendMessage(activeYoutubeTabID,{message: "newInfos"});			}
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
					sendResponse({compatible: compatiblePages, hasSelectedPage: hasSelectedPage});
				break;
				case `getTimeStamps`:
					sendResponse({timeStamps: timeStamps, pageTitle: ytTabTitle, videoCurrentTime: videoCurrentTime  ,videoDuration: videoDuration, compatiblePages: compatiblePages});
				break;
				case `getCurrentTime`:
					sendResponse({videoCurrentTime: videoCurrentTime})
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
