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
	
	let titleCardDiv = document.createElement("div");
	titleCardDiv.classList.add('card');
	titleCardDiv.classList.add('large');
	let titleDiv = document.createElement("div");
	titleDiv.classList.add("section");
	let titleHThree = document.createElement("h3");
	titleHThree.id = "title";
	let subtitle = document.createElement("small");
	subtitle.id = "subtitle";
	titleHThree.appendChild(subtitle);
	titleDiv.appendChild(titleHThree);
	titleCardDiv.appendChild(titleDiv);
	document.body.appendChild(titleCardDiv);

	if (hasSelectedPage) {
		let buttonsCardDiv = document.createElement("div");
		buttonsCardDiv.classList.add('card');
		buttonsCardDiv.classList.add('large');
		let buttonsDiv = document.createElement("div");
		buttonsDiv.classList.add("section");
		buttonsDiv.id = "controlButtons";
		let buttonsToCreate = ["fast_rewind","skip_previous","play_arrow","skip_next","fast_forward"]
		for (let i = 0; i < buttonsToCreate.length; i++) {
			let button = document.createElement("button");
			button.classList.add('small');
			let iTag = document.createElement('i');
			iTag.classList.add('material-icons');
			iTag.innerHTML = buttonsToCreate[i];
			button.appendChild(iTag);
			buttonsDiv.appendChild(button);
		}
		let pTag = document.createElement('p');
		pTag.id = "timer";
		pTag.innerHTML = "00:00";
		buttonsDiv.appendChild(pTag);
		buttonsCardDiv.appendChild(buttonsDiv);
		document.body.appendChild(buttonsCardDiv);

		if (compatibilityCheck.compatible) {
			let tsCardDiv = document.createElement("div");
			tsCardDiv.classList.add('card');
			tsCardDiv.classList.add('large');
			let tsDiv = document.createElement("div");
			tsDiv.classList.add("section");
			let tsHThree = document.createElement("h3");
			tsHThree.innerHTML = "Time stamps";
			let tsP = document.createElement("p");
			tsP.id = "timeStamps";
			tsDiv.appendChild(tsHThree);
			tsDiv.appendChild(tsP);
			tsCardDiv.appendChild(tsDiv);
			document.body.appendChild(tsCardDiv);



			browser.runtime.sendMessage({message: "getTimeStamps" , senderScript: "actionPopUp"})
			.then(message => {
				timeStamps = message.timeStamps;
				ytTabTitle = message.pageTitle;
				videoCurrentTime = message.videoCurrentTime;
				videoDuration = message.videoDuration;
				})
			.then(() => {
				windowUpdater();
				document.getElementById("title").textContent = ytTabTitle;
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
				document.getElementById("timeStamps").appendChild(tempOl);
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