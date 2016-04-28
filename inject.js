var port = chrome.runtime.connect({name: "channel"});

var ids = {};

var processMessages = function() {
  var newMessages = [];
  var bubbles = $$('.bubble-text');
  var chatTitle = $$('.pane-header .chat-title')

  for(var i = bubbles.length - 1; i >= 0; i--) {
    var bubble = $$(bubbles[i]);
    var reactid = bubble.data('reactid');

    if (reactid in ids) {
      break;
    }
    ids[reactid] = true;

    var text = bubble.find('.message-text .emojitext').text();
    var user = chatTitle.find('.emojitext').text();
    var messageOut = bubble.parent().hasClass('message-out');
    var time = bubble.find('.message-meta .message-datetime').text();

    newMessages.push({
      reactid: reactid,
      text: text,
      user: user,
      messageOut: messageOut,
      time: time
    });
  }

  return newMessages;
}

var messages = processMessages();
console.log('Existing messages: ', messages);


setInterval(function() {
  console.log("Pooling for new messages...");
  var newMessages = processMessages();
  for (newMessage of newMessages) {
    messages.unshift(newMessage);
    var text = newMessage.text;
    var user = newMessage.user;
    var direction = newMessage.messageOut ? "output" : "input";
    var time = newMessage.time;
    console.log("New "+ direction +" message from "+ user +" at "+ time +", posting to extension: " + text);
    port.postMessage({message: text});
  }
}, 5000)

