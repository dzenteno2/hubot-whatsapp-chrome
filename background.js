// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Load jQuery and Moment into page
  chrome.tabs.executeScript(null, { file: "lib/jquery.js" }, function() {

    // Connect to page
    chrome.runtime.onConnect.addListener(function(port) {
      // When page sends a message, we pass it to socket.io
      port.onMessage.addListener(function(data) {
        console.log('message: ', data.message);
      });
      
    });

    // Load content script on page 
    chrome.tabs.executeScript(null, { file: "inject.js" });

  });
});

