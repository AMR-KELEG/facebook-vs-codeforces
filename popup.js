// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

// chrome.storage.sync.set({ "yourBody": "myBody" }, function(){
//     //  A data saved callback omg so fancy
// });

// chrome.storage.sync.get(/* String or Array */["yourBody"], function(items){
//     //  items = [ { "yourBody": "myBody" } ]
// });

//  LOCAL Storage

// Save data to storage locally, in just this browser...



function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });


  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}


function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    var CODEFORCES=0;
    var FACEBOOK=0;
    var CURRENTTIME=new Date().getTime() / 1000;
    if(url.indexOf("codeforces") !== -1)
    {
      CODEFORCES++;
    }
    else if(url.indexOf("facebook") !== -1)
    {
      FACEBOOK++;
    }

    chrome.storage.local.get(["codeforces","facebook","time"], function(items){ 
    // chrome.storage.local.get(["codeforces","facebook"], function(items){ 
        if(!items["codeforces"])
          items["codeforces"]=0;
        if(!items["facebook"])
          items["facebook"]=0;
        if(!items["time"])
          items["time"]=CURRENTTIME;
        if(CURRENTTIME-items["time"]>3600)
        {
          //Reset Counters
          items["codeforces"]=0;
          items["facebook"]=0;
          items["time"]=CURRENTTIME;
        }

        CODEFORCES=CODEFORCES+items["codeforces"];
        FACEBOOK=FACEBOOK+items["facebook"];
        renderStatus(CODEFORCES +'/'+ FACEBOOK); 
        
        chrome.storage.local.set({ "facebook": FACEBOOK ,"codeforces": CODEFORCES , "time" : CURRENTTIME}, function(){
        // chrome.storage.local.set({ "facebook": FACEBOOK ,"codeforces": CODEFORCES}, function(){
        });
    });
    
  });
});