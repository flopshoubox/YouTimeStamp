console.log("hello");

let timeStamps = [];
let ytTabTitle = "";
let videoCurrentTime = 0;
let videoDuration = 0;
let hasSelectedPage = false;

const onLinkClick = (element) => {
	browser.runtime.sendMessage({message: "setCurrentTime" , senderScript: "actionPopUp", newTime: element.dataset.timeStamp})
}

const onMouseEnterDescription = (element) => {
	element.style.color = 'blue';
	element.innerHTML = `${element.innerHTML} - ${element.dataset.display}`;
}
const onMouseLeaveDescription = (element) => {
	element.style.color = 'black';
	element.innerHTML = element.innerHTML.replace(` - ${element.dataset.display}`, "");
}

const updateTimer = () => {
	let tsTimer = document.getElementById("timer");
	tsTimer.innerHTML = `${videoCurrentTime} / ${videoDuration}`;
}

// const updateCurrentlyPlaying = () => {
// 	let tSDiv = document.getElementById("timeStamps");
// 	let treeWalker = document.createTreeWalker(
//  		document.body,
//   		NodeFilter.SHOW_ELEMENT,
//   		{ acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } },
//   		false
// 	);
// 	while(treeWalker.nextNode()){
// 		if (treeWalker.currentNode.) {}
// 	}
// };

const pageUpdate = () => {
	
}

browser.runtime.sendMessage({message: "compatibilityCheck" , senderScript: "actionPopUp"})
.then(compatibilityCheck => {
	hasSelectedPage = compatibilityCheck.hasSelectedPage;
	let tSDiv = document.getElementById("timeStamps");
	let tsSubTitle = document.getElementsByTagName("H2")[0];

	if (hasSelectedPage) {
		if (compatibilityCheck.compatible) {
			browser.runtime.sendMessage({message: "getTimeStamps" , senderScript: "actionPopUp"})
			.then(message => {
				timeStamps = message.timeStamps;
				ytTabTitle = message.pageTitle;
				videoCurrentTime = message.videoCurrentTime;
				videoDuration = message.videoDuration;
				})
			.then(() => {
				updateTimer();
				tsSubTitle.innerHTML = ytTabTitle;
				timeStamps.forEach((timeStamp) => {
					let tempDiv = document.createElement("div");
					let tempImg = document.createElement("img");
					tempImg.alt = "play";
					tempImg.src = "play.png";
					tempImg.height = 10;
					tempImg.width = 10;
					
					let descSpan = document.createElement("span");
					descSpan.innerHTML = ` - ${timeStamp.description}`;
					descSpan.dataset.display = timeStamp.display;
					descSpan.addEventListener("mouseenter", () => onMouseEnterDescription(descSpan), true);
					descSpan.addEventListener("mouseleave", () => onMouseLeaveDescription(descSpan), true);

					tempDiv.appendChild(tempImg);
					tempDiv.appendChild(descSpan);
					tempDiv.dataset.timeStamp = timeStamp.url.match(/t=\d+/)[0].substring(2);
					tempDiv.addEventListener("click", () => onLinkClick(tempDiv), true);
					tSDiv.appendChild(tempDiv);
				})
			});
		}
		else{
			let errSpan = document.createElement("span");
			errSpan.innerHTML = "Waiting";
			tsSubTitle.appendChild(errSpan);
		}
	}
	else{
		let errSpan = document.createElement("span");
		errSpan.innerHTML = "No page selected";
		tsSubTitle.appendChild(errSpan);
	}
});


const timeAsker = () => {
	if (hasSelectedPage) {
		browser.runtime.sendMessage({message: "getCurrentTime" , senderScript: "actionPopUp"})
		.then( answer => {
			videoCurrentTime = answer.videoCurrentTime;
			updateTimer();
		});
	}	
}

window.setInterval(timeAsker, 100);