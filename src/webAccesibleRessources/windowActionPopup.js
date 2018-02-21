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
	console.log("popup - onLinkClick - launched");
	browser.runtime.sendMessage({message: "setCurrentTime" , senderScript: "actionPopUp", newTime: element.dataset.timeStamp})
}

const onMouseEnterDescription = (element) => {
	console.log("popup - onMouseEnterDescription - launched");
	element.style.color = "blue";
	element.innerHTML = `${element.innerHTML} - ${element.dataset.display}`;
}
const onMouseLeaveDescription = (element) => {
	console.log("popup - onMouseLeaveDescription - launched");
	element.style.color = "black";
	element.innerHTML = element.textContent.replace(` - ${element.dataset.display}`, "");
}

const buttonsCardCreator = (buttonsToCreate) => {
	console.log("popup - buttonsCardCreator - launched");
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

const timerInfosGetter = () => {
	console.log("popup - timerInfosGetter - launched");
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

const timerUpdater = () => {
	console.log("popup - timerUpdater - launched");

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
	console.log("popup - titleCardCreator - launched");
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
	console.log("popup - navInfosGetter - launched");
	let answer = await browser.runtime.sendMessage({message: "getNavInfos" , senderScript: "actionPopUp"});
	videoTitle = answer.videoTitle;
}

const titleUpdater = (inputText) => {
	console.log("popup - titleUpdater - launched");
	document.getElementById("title").textContent = inputText;
}

const subTitleUpdater = (inputText) => {
	console.log("popup - subTitleUpdater - launched");
	document.getElementById("subtitle").textContent = inputText;
}

const tsCardCreator = () => {
	console.log("popup - tsCardCreator - launched");
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
	console.log("popup - tsGetter - launched");
	let answer = await browser.runtime.sendMessage({message: "getTimeStamps" , senderScript: "actionPopUp"})
	timeStamps = answer.timeStamps;
}

const tsUpdater = async () => {
	console.log("popup - tsUpdater - launched");
	console.log(timeStamps);
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
	if (tsp.hasChildNodes()) {
		console.log("hasChildNodes");
		tsp.replaceChild(tsp.firstChild, tempOl);
	}
	else{
		console.log("hasChildNodes");
		tsp.appendChild(tempOl);
	}
}

const windowLoader = async () => {
	console.log("popup - windowLoader - launched");
	compatibilityCheck = await browser.runtime.sendMessage({message: "compatibilityCheck" , senderScript: "actionPopUp"});
	hasSelectedPage = compatibilityCheck.hasSelectedPage;
	console.log(`compatibilityCheck.compatible = ${compatibilityCheck.compatible}`)
	console.log("titleCardCreator");
	titleCardCreator();
	if (hasSelectedPage) {
		console.log("navInfosGetter");
		await navInfosGetter();
		console.log("titleUpdater");
		titleUpdater(videoTitle);
		console.log("buttonsCardCreator");
		buttonsCardCreator(["fast_rewind","skip_previous","play_arrow","skip_next","fast_forward"]);
		if (compatibilityCheck.compatible) {
			console.log("tsCardCreator");
			tsCardCreator();
			console.log("tsUpdater");
			await tsGetter();
			await tsUpdater();
		}
		else{
			console.log("subTitleUpdater");
			subTitleUpdater("This tab has no timeStamps");
		}
	}
	else{
		console.log("titleUpdater");
		titleUpdater("No choosen tab");
		subtitlePart.textContent = "Please choose a tab to track by clicking on the play button on the right of the URL bar while beeing on a YouTube page";
	}
}

windowLoader();
window.setInterval(() => {
	timerInfosGetter();
	timerUpdater();}
	, 100);
window.setInterval(() => {
	navInfosGetter()
	.then(() => {
		titleUpdater(videoTitle);
	})
	tsGetter()
	.then(() => {tsUpdater()});
},2000)