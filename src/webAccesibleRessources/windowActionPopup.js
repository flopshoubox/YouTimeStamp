console.log("hello");

let timeStamps = [];
let pageTitle = "";
let videoCurrentTime = 0;
let videoDuration = 0;
let hasSelectedPage = false;
let currentlyPlayingDesc = "";
let currentlyPlayingNumber = 0;
let textTitleHThree;

const onLinkClick = (element) => {
	browser.runtime.sendMessage({message: "setCurrentTime" , senderScript: "actionPopUp", newTime: element.dataset.timeStamp})
}

const onMouseEnterDescription = (element) => {
	element.style.color = "blue";
	element.innerHTML = `${element.innerHTML} - ${element.dataset.display}`;
}
const onMouseLeaveDescription = (element) => {
	element.style.color = "black";
	element.innerHTML = element.textContent.replace(` - ${element.dataset.display}`, "");
}

const windowUpdater = () => {
	let tsTimer = document.getElementById("timer");
	if (currentlyPlayingNumber != 0) {
		tsTimer.textContent = `${videoCurrentTime} / ${videoDuration} -> "${currentlyPlayingNumber} - ${currentlyPlayingDesc}"`;
		let elementList = document.getElementsByClassName("tsListElement");
		for (let i = 0; i < elementList.length; i++) {
			if (elementList[i].style.color != "blue") {
				elementList[i].style.color = "black";
			}
		}
		document.getElementById(`tsLiNum${currentlyPlayingNumber}`).style.color = 'red';
	}
	else{
		tsTimer.textContent = `${videoCurrentTime} / ${videoDuration}`;
	}
}

const windowLoader = () => {
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
		textTitleHThree = document.createTextNode(""); 
		textTitleHThree.id = "title";
		titleHThree.appendChild(textTitleHThree);
		let subtitlePart = document.createElement("small");
		let textsubtitlePart = document.createTextNode("");
		textsubtitlePart.id = "subtitle";
		subtitlePart.appendChild(textsubtitlePart);
		titleHThree.appendChild(subtitlePart);
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
			let timerPTag = document.createElement('p');
			timerPTag.id = "timer";
			timerPTag.innerHTML = "00:00";
			buttonsDiv.appendChild(timerPTag);
			buttonsCardDiv.appendChild(buttonsDiv);
			document.body.appendChild(buttonsCardDiv);

			if (compatibilityCheck.compatible) {
				let tsCardDiv = document.createElement("div");
				tsCardDiv.classList.add('card');
				tsCardDiv.classList.add('large');
				let tsDiv = document.createElement("div");
				tsDiv.classList.add("section");
				let tsHThree = document.createElement("h3");
				let textTsHThree = document.createTextNode("Time stamps");
				tsHThree.appendChild(textTsHThree);
				let tsP = document.createElement("p");
				tsP.id = "timeStamps";
				tsDiv.appendChild(tsHThree);
				tsDiv.appendChild(tsP);
				tsCardDiv.appendChild(tsDiv);
				document.body.appendChild(tsCardDiv);

				browser.runtime.sendMessage({message: "getTimeStamps" , senderScript: "actionPopUp"})
				.then(message => {
					timeStamps = message.timeStamps;
					pageTitle = message.pageTitle;
					})
				.then(() => {
					windowUpdater();
					textTitleHThree.textContent = pageTitle;
					let tempOl = document.createElement("ol");
					let i = 0;
					timeStamps.forEach((timeStamp) => {
						i++;
						let tempLi = document.createElement("li");
						let textTempLi = document.createTextNode(`${timeStamp.description}`);
						tempLi.appendChild(textTempLi);
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
				subtitlePart.textContent = "This tab has no timeStamps";
			}
		}
		else{
			textTitleHThree.textContent = "No choosen tab";
			subtitlePart.textContent = "Please choose a tab to track by clicking on the play button on the right of the URL bar while beeing on a YouTube page";
		}
	});
}



const timerAsker = () => {
	if (hasSelectedPage) {
		browser.runtime.sendMessage({message: "getCurrentState" , senderScript: "actionPopUp"})
		.then( answer => {
			videoCurrentTime = answer.videoCurrentTime;
			currentlyPlayingDesc = answer.currentlyPlayingDesc;
			currentlyPlayingNumber = answer.currentlyPlayingNumber;
			videoDuration = answer.videoDuration;
			windowUpdater();
		});
	}
}
windowLoader();
window.setInterval(timerAsker, 100);