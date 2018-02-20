console.log("background");

let timeStamps,
	activeYoutubeTabID,
	videoTitle,
	videoCurrentTime,
	currentlyPlayingDesc,
	videoDuration,
	compatiblePage,
	hasSelectedPage,
	currentlyPlayingNumber;



const initVar = () => {
	timeStamps = [],
	activeYoutubeTabID = -1,
	videoTitle = "",
	videoCurrentTime = 0,
	currentlyPlayingDesc = "",
	videoDuration = 0,
	compatiblePage = false,
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
				hasTimeStampsCheck();
			}
		}
		else{
			if (activeYoutubeTabID == tabId){
				initVar();
				browser.browserAction.setBadgeText({text: ''});
			}
		}
	}
}

const hasTimeStampsCheck = async () => {
	let answer = await browser.tabs.sendMessage(activeYoutubeTabID, {message: "getTimeStamps"});
	timeStamps.length = 0;
	timeStamps = answer.timeStamps;
	if (timeStamps.length > 0) {
		compatiblePage = true;
		browser.browserAction.setBadgeText({text: ":)"});
	}
	else {
		compatiblePage = false;
		browser.browserAction.setBadgeText({text: ''});
	}
	return compatiblePage;
}

const handlePageActionClick = async (tab) => {
	if (activeYoutubeTabID != tab.id) {
		browser.tabs.sendMessage(activeYoutubeTabID,{message: "noMoreYou"});
		browser.pageAction.setIcon({tabId: activeYoutubeTabID, path: "../pageAction/playNav-grey.png"});

		browser.tabs.sendMessage(tab.id,{message: "choosingYou"});
		browser.pageAction.setIcon({tabId: tab.id, path: "../pageAction/playNav-blue.png"});
		activeYoutubeTabID = tab.id;
		hasSelectedPage = true;
		await hasTimeStampsCheck();
	}
	else{
		browser.tabs.sendMessage(tab.id,{message: "noMoreYou"});
		browser.pageAction.setIcon({tabId: tab.id, path: "../pageAction/playNav-grey.png"});
		initVar();
		browser.browserAction.setBadgeText({text: ''});
	}
	//changing icon and favicon
}

const handleMessage = (request, sender, sendResponse) => {
	switch (request.senderScript){
		case `content`:
			switch (request.message){
				case `currentTime`:
					videoCurrentTime = request.currentTime;
				break;
				case `currentlyPlaying`:
					currentlyPlayingDesc = request.currentlyPlayingDesc;
					currentlyPlayingNumber = request.currentlyPlayingNumber;
					videoDuration = request.videoDuration;
					videoTitle = request.videoTitle;
				break;
			}
		break;

		case `actionPopUp`:
			switch (request.message){
				case `compatibilityCheck`:
					hasTimeStampsCheck()
					.then(sendResponse({compatible: compatiblePage, hasSelectedPage: hasSelectedPage}));
				break;
				case `getNavInfos`:
					sendResponse(browser.tabs.sendMessage(activeYoutubeTabID, {message: "getNavInfos"}));
				break;
				case `getTimeStamps`:
					browser.tabs.sendMessage(activeYoutubeTabID, {message: "getTimeStamps"})
					.then((answer) => {
						timeStamps = answer.timeStamps;
						if (timeStamps.length > 0) {
							compatiblePage = true;
							browser.browserAction.setBadgeText({text: ":)"});
						}
						else {
							compatiblePage = false;
							browser.browserAction.setBadgeText({text: ""});
						}
					});
					sendResponse({timeStamps: timeStamps});
				break;
				case `getTimerInfos`:
					sendResponse(browser.tabs.sendMessage(activeYoutubeTabID, {message: "getTimerInfos"}));
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
