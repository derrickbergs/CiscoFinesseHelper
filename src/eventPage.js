chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.action == "currentStatus"){
		if(request.currentstatus.toString().includes("Not Ready")){
			chrome.browserAction.setBadgeText({ text: " " });
			chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
		}else if(request.currentstatus.toString().includes("Talking")){
			chrome.browserAction.setBadgeText({ text: " " });
			chrome.browserAction.setBadgeBackgroundColor({ color: [244, 179, 66, 255] });
		}else{
			chrome.browserAction.setBadgeText({ text: " " });
			chrome.browserAction.setBadgeBackgroundColor({ color: [0, 200, 0, 255] });
		}
	}else if(request.action == "launchFinesse"){
		var newURL = "https://usgsovoice009.srv.volvo.com/";
		chrome.tabs.create({ url: newURL });
	}else if(request.action == "readyCounter"){
		//This function also tests whether we're in the same day. If a day has ellapsed, the counter is reset.
		var readyTime;
		var date = new Date();
		var lastTime;
		var currentTime = date.getDay();
		chrome.storage.local.get(['lastTime'], function(result) {
			if(result.lastTime == undefined){
				lastTime = 0;
			}else{
				lastTime = result.lastTime;
			}
			if(lastTime != currentTime){
				readyTime = 0;
				chrome.storage.local.set({readyTime: readyTime}, function() {
					
				});
			}
			console.log("lastTime: " + lastTime + " currentTime: " + currentTime);
		});
		chrome.storage.local.get(['readyTime'], function(result) {
			if(result.readyTime == undefined){
				readyTime = 0;
			}else{
				readyTime = parseInt(result.readyTime, 10);
			}
			readyTime += 1;
			chrome.storage.local.set({readyTime: readyTime}, function() {

			});
		});
		chrome.storage.local.set({lastTime: currentTime}, function() {
			
		});
	}
});


//Checks if Cisco Finesse exists after a tab is closed.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	var i;
	var qntTabs;
	var finesseExists;
	chrome.tabs.query({ title: "*Cisco Finesse*" }, function (tabs) {
		finesseExists = false;
		qntTabs = tabs.length;
		for(i=0;i<qntTabs;i++){
			if(tabs[i].title.toString().includes("Cisco Finesse")){
				finesseExists = true;
			}
		}
		if(finesseExists == false){
			chrome.browserAction.setBadgeText({ text: " " });
			chrome.browserAction.setBadgeBackgroundColor({ color: [123, 123, 123, 255] });
		}
	});
});

//Makes tab undiscardable.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	var i;
	var qntTabs;
	chrome.tabs.query({ title: "*Cisco Finesse*" }, function (tabs) {
		qntTabs = tabs.length;
		for(i=0;i<qntTabs;i++){
			if(tabs[i].title.toString().includes("Cisco Finesse")){
				tabs[i].autoDiscardable = false;
			}
		}
	});
});