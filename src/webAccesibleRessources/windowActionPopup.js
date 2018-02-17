console.log("hello");

let timeStamps = [];
let ytTabTitle = "";
let videoCurrentTime = 0;
let videoDuration = 0;
let hasSelectedPage = false;
let currentlyPlayingDesc = "";
let currentlyPlayingNumber = 0;

const onLinkClick = (element) => {
	browser.runtime.sendMessage({message: "setCurrentTime" , senderScript: "actionPopUp", newTime: element.dataset.timeStamp})
}

const onMouseEnterDescription = (element) => {
	element.style.color = "blue";
	element.innerHTML = `${element.innerHTML} - ${element.dataset.display}`;
}
const onMouseLeaveDescription = (element) => {
	element.style.color = "#444";
	element.innerHTML = element.innerHTML.replace(` - ${element.dataset.display}`, "");
}

const windowUpdater = () => {
	let tsTimer = document.getElementById("timer");
	tsTimer.innerHTML = `${videoCurrentTime} / ${videoDuration} -> "${currentlyPlayingNumber} - ${currentlyPlayingDesc}"`;
	if (currentlyPlayingNumber != 0) {
		let elementList = document.getElementsByClassName("tsListElement");
		for (let i = 0; i < elementList.length; i++) {
			elementList[i].style.color = "black";
		}
		document.getElementById(`tsLiNum${currentlyPlayingNumber}`).style.color = 'red';
	}
	
}

browser.runtime.sendMessage({message: "compatibilityCheck" , senderScript: "actionPopUp"})
.then(compatibilityCheck => {
	hasSelectedPage = compatibilityCheck.hasSelectedPage;
	let tsContent = document.getElementById("timeStamps");
	let tsSubTitle = document.getElementById("videoTitle");
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
				windowUpdater();
				tsSubTitle.textContent = ytTabTitle;
				let tempOl = document.createElement("ol");
				let i = 0;
				timeStamps.forEach((timeStamp) => {
					i++;
					let tempLi = document.createElement("li");
					tempLi.innerHTML = `${timeStamp.description}`;
					tempLi.dataset.display = timeStamp.display;
					tempLi.dataset.timeStamp = timeStamp.url.match(/t=\d+/)[0].substring(2);;
					tempLi.id = `tsLiNum${i}`;
					tempLi.classList.add('tsListElement');
					tempLi.addEventListener("mouseenter", () => onMouseEnterDescription(tempLi), true);
					tempLi.addEventListener("mouseleave", () => onMouseLeaveDescription(tempLi), true);
					tempLi.addEventListener("click", () => onLinkClick(tempLi), true);
					tempOl.appendChild(tempLi);
				});
				tsContent.appendChild(tempOl);
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


const timerAsker = () => {
	if (hasSelectedPage) {
		browser.runtime.sendMessage({message: "getCurrentState" , senderScript: "actionPopUp"})
		.then( answer => {
			videoCurrentTime = answer.videoCurrentTime;
			currentlyPlayingDesc = answer.currentlyPlayingDesc;
			currentlyPlayingNumber = answer.currentlyPlayingNumber;
			windowUpdater();
		});
	}	
}

window.setInterval(timerAsker, 100);