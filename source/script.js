var id = 100;
function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.withCredentials = true;
    xhr.responseType = 'blob';
    xhr.send();
}
function getword(info, tab) {
    ///var viewTabUrl = chrome.extension.getURL('painter.html?id=' + id++)
    
    //alert("getword 001 - info.srcUrl" + info.srcUrl);
    //alert("getword 001 - info.targetUrlPatterns" + info.targetUrlPatterns);
    //alert("getword 001 - info.getURL" + info.viewTabUrl);
    console.log("info.linkUrl=" + info.linkUrl);
    const linkUrl = info.linkUrl;
    //const urlParams = new URLSearchParams(linkUrl);
    //const myParamImgurl = urlParams.get('imgurl');
    //console.log("myParamImgurl=" + myParamImgurl);
    
    var imgurl_pos = linkUrl.indexOf("imgurl");
    var imgurl_url = linkUrl.substr(linkUrl.indexOf("imgurl")+7,linkUrl.length-linkUrl.indexOf("imgurl")-7);

    var imgurl_url_short_pos = imgurl_url.indexOf("&");
    var imgurl_url_short_url = imgurl_url.substr(0,imgurl_url.indexOf("&"));
    var imgurl_url_short_url_unescape = unescape(imgurl_url_short_url);
    
    //debugger

    //var viewTabUrl = 'https://paintforwhatsapp.com/editor/v11/editor.html?srcUrl=' + info.srcUrl
    var viewTabUrl = 'https://paintforwhatsapp.com/editor/v12/editor.html?imgUrl=' + imgurl_url_short_url_unescape
    
    chrome.tabs.create({url: viewTabUrl}, function(tab) {
      targetId = tab.id;
    });

    //targetUrlPatterns

    //var viewTabUrl = chrome.extension.getURL('./editor/editor.html?id=' + id++);
    //var viewTabUrl = 'https://paintforwhatsapp.com/editor/v11/editor.html?srcUrl=' + info.srcUrl
    
    //chrome.tabs.create({url: viewTabUrl}, function(tab) {
    //  targetId = tab.id;
    //});

    /*
    var viewTabUrl = chrome.extension.getURL('./editor/editor.html?id=' + id++)
    var targetId = null;
    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
      // We are waiting for the tab we opened to finish loading.
      // Check that the tab's id matches the tab we opened,
      // and that the tab is done loading.
      if (tabId != targetId || changedProps.status != "complete")
        return;

      // Passing the above test means this is the event we were waiting for.
      // There is nothing we need to do for future onUpdated events, so we
      // use removeListner to stop getting called when onUpdated events fire.
      chrome.tabs.onUpdated.removeListener(listener);

      // Look through all views to find the window which will display
      // the screenshot.  The url of the tab which will display the
      // screenshot includes a query parameter with a unique id, which
      // ensures that exactly one view will have the matching URL.
      var views = chrome.extension.getViews();
      for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (view.location.href == viewTabUrl) {
            toDataUrl(info.srcUrl, function(myBase64) {
                view.setCanvasUrl(myBase64);
                console.log(myBase64); // myBase64 is the base64 string
            });
            
          
          break;
        }
      }
    });
    //console.log("Word " + info + " was clicked.");
    chrome.tabs.create({url: viewTabUrl}, function(tab) {
        targetId = tab.id;
      });
    // chrome.tabs.create({
    //     url: "http://www.google.com/search?q=" + info.selectionText
    // });
    */

}

function getword_OLD(info, tab) {
  ///var viewTabUrl = chrome.extension.getURL('painter.html?id=' + id++)
  var viewTabUrl = chrome.extension.getURL('./editor/editor.html?id=' + id++)
  var targetId = null;
  chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
    // We are waiting for the tab we opened to finish loading.
    // Check that the tab's id matches the tab we opened,
    // and that the tab is done loading.
    if (tabId != targetId || changedProps.status != "complete")
      return;

    // Passing the above test means this is the event we were waiting for.
    // There is nothing we need to do for future onUpdated events, so we
    // use removeListner to stop getting called when onUpdated events fire.
    chrome.tabs.onUpdated.removeListener(listener);

    // Look through all views to find the window which will display
    // the screenshot.  The url of the tab which will display the
    // screenshot includes a query parameter with a unique id, which
    // ensures that exactly one view will have the matching URL.
    var views = chrome.extension.getViews();
    for (var i = 0; i < views.length; i++) {
      var view = views[i];
      if (view.location.href == viewTabUrl) {
          toDataUrl(info.srcUrl, function(myBase64) {
              view.setCanvasUrl(myBase64);
              console.log(myBase64); // myBase64 is the base64 string
          });
          
        
        break;
      }
    }
  });
  //console.log("Word " + info + " was clicked.");
  chrome.tabs.create({url: viewTabUrl}, function(tab) {
      targetId = tab.id;
    });
  // chrome.tabs.create({
  //     url: "http://www.google.com/search?q=" + info.selectionText
  // });
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: "Edit and Share with Paint for Whatsapp™ Web",
        contexts: ["image"],
        onclick: getword
    });
});
