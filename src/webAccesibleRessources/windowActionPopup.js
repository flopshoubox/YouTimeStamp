console.log("hello");

let timeStamps = [];
let ytTabTitle;
let videoCurrentTime;
let videoDuration;

const onClick = (url) => {
	console.log(url);
}

const onMouseEnter = (element) => {
	element.style.color = 'blue';
}
const onMouseLeave = (element) => {
	element.style.color = 'black';
}

const updateTimer = () => {
	let tsTimer = document.getElementById("timer");
	tsTimer.innerHTML = `${videoCurrentTime} / ${videoDuration}`;
}

try {
	let answer = browser.runtime.sendMessage({message: "getTimeStamps" , senderScript: "actionPopUp"})
		.then(message => {
			timeStamps = message.timeStamps;
			ytTabTitle = message.pageTitle;
			videoCurrentTime = message.videoCurrentTime;
			videoDuration = message.videoDuration;
			})
		.then(() => {
			updateTimer();
			let tsSubTitle = document.getElementsByTagName("H2")[0];
			tsSubTitle.innerHTML = ytTabTitle;
			let tSDiv = document.getElementById("timeStamps");
			timeStamps.forEach((timeStamp) => {
				let tempDiv = document.createElement("div");
				let tempImg = document.createElement("img");
				tempImg.alt = timeStamp.display;
				tempImg.src = "play.png";
				tempImg.height = 10;
				tempImg.width = 10;

				let descSpan = document.createElement("span");
				descSpan.innerHTML = ` - ${timeStamp.description}`;
				
				tempDiv.appendChild(tempImg);
				tempDiv.appendChild(descSpan);
				tempDiv.addEventListener("click", () => onClick(timeStamp.url), true);
				tempDiv.addEventListener("mouseenter", () => onMouseEnter(tempDiv), true);
				tempDiv.addEventListener("mouseleave", () => onMouseLeave(tempDiv), true);
				tSDiv.appendChild(tempDiv);
		})	
	})
} catch (err) {
	console.log(err);
}

const timeAsker = () => {
	browser.runtime.sendMessage({message: "getCurrentTime" , senderScript: "actionPopUp"})
		.then( answer => {
			videoCurrentTime = answer.videoCurrentTime;
			updateTimer();
		})
}

window.setInterval(timeAsker, 100);