console.log("hello");

let timeStamps = [];
let videoTitle = "";
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

const buttonsCardCreator = (buttonsToCreate) => {
	let buttonsCardDiv = document.createElement("div");
	buttonsCardDiv.classList.add('card');
	buttonsCardDiv.classList.add('large');
	let buttonsDiv = document.createElement("div");
	buttonsDiv.classList.add("section");
	buttonsDiv.id = "controlButtons";
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
}

const timerUpdater = () => {
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

const titleCardCreator = () => {
	let titleCardDiv = document.createElement("div");
	titleCardDiv.classList.add('card');
	titleCardDiv.classList.add('large');
	let titleDiv = document.createElement("div");
	titleDiv.classList.add("section");
	let titleHThree = document.createElement("h3");
	titleHThree.id = "title";
	textTitleHThree = document.createTextNode(" "); 
	titleHThree.appendChild(textTitleHThree);
	let subtitlePart = document.createElement("small");
	subtitlePart.id = "subtitle";
	let textsubtitlePart = document.createTextNode(" ");
	subtitlePart.appendChild(textsubtitlePart);
	titleHThree.appendChild(subtitlePart);
	titleDiv.appendChild(titleHThree);
	titleCardDiv.appendChild(titleDiv);
	document.body.appendChild(titleCardDiv);
}

const navInfosGetter = async () => {
	let answer = await browser.runtime.sendMessage({message: "getNavInfos" , senderScript: "actionPopUp"});
	videoTitle = answer.videoTitle;
}

const titleUpdater = (inputText) => {
	document.getElementById("title").textContent = inputText;
}

const subTitleUpdater = (inputText) => {
	document.getElementById("subtitle").textContent = inputText;
}

const tsCardCreator = () => {
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
}

const tsGetter = async () => {
	let answer = await browser.runtime.sendMessage({message: "getTimeStamps" , senderScript: "actionPopUp"})
	timeStamps = answer.timeStamps;
}

const tsUpdater = async () => {
	await tsGetter();
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
	let tsp = document.getElementById("timeStamps");
	if (tsp.firstChild != null) {
		window.alert("toto");
		tsp.replaceChild(tsp.firstChild, tempOl);
	}
	else{
		tsp.appendChild(tempOl);
	}
}

const windowLoader = async () => {
	compatibilityCheck = await browser.runtime.sendMessage({message: "compatibilityCheck" , senderScript: "actionPopUp"});
	hasSelectedPage = compatibilityCheck.hasSelectedPage;
	titleCardCreator();
	if (hasSelectedPage) {
		await navInfosGetter();
		titleUpdater(videoTitle);
		buttonsCardCreator(["fast_rewind","skip_previous","play_arrow","skip_next","fast_forward"]);
		if (compatibilityCheck.compatible) {
			tsCardCreator();
			await tsUpdater();
		}
		else{
			window.alert("No timeStamps");
			subTitleUpdater("This tab has no timeStamps");
		}
	}
	else{
		titleUpdater("No choosen tab");
		subtitlePart.textContent = "Please choose a tab to track by clicking on the play button on the right of the URL bar while beeing on a YouTube page";
	}
}

const timerInfosGetter = () => {
	if (hasSelectedPage) {
		browser.runtime.sendMessage({message: "getTimerInfos" , senderScript: "actionPopUp"})
		.then( answer => {
			videoCurrentTime = answer.videoCurrentTime;
			currentlyPlayingDesc = answer.currentlyPlayingDesc;
			currentlyPlayingNumber = answer.currentlyPlayingNumber;
			videoDuration = answer.videoDuration;
		});
	}
}




windowLoader();
window.setInterval(() => {
	timerInfosGetter();
	timerUpdater();}
	, 100);
window.setInterval(() => {
	navInfosGetter();
	titleUpdater(videoTitle);
	subtitleUpdater();
	tsUpdater();
},2000)