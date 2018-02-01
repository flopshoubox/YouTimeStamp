const tsDiv = document.getElementById(timeStamps);

let timeStampsToShow = [];

const handleMessage = (request, sender, sendResponse) => {
	let tempDiv = document.createElement("div");
	let counter = 0;
	request.message.forEach((timeStamp) => {
		let subDiv = document.createElement("div");
		subDiv.innerHTML = `${timeStamp.display}`
		tempDiv.appendChild(subDiv);
	});
	tsDiv.parentNode.replaceChild(tempDiv,tsDiv);
}

browser.tabs.onMessage.addListener(handleMessage);
