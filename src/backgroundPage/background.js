console.log("background");

const handleMessage = (request, sender, sendResponse) => {
// 	console.log(request.message);
// 	console.log(sender.tab.id);
// }

	switch (request.senderScript){
		case `content`:
			try{
				browser.tabs.sendMessage(sender.tab.id, {message: request.message, senderScript: background});
			} catch(e){console.log(e)}
			break;
	}	
}
browser.runtime.onMessage.addListener(handleMessage);
