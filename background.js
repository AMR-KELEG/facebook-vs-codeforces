function updateCounters(tabId, changeInfo, tab) {
    var url = tab.url;
    var CODEFORCES=0;
    var FACEBOOK=0;
    var CURRENTTIME=new Date().getTime();
    if(url.indexOf("codeforces") !== -1)
    {
      CODEFORCES++;
    }
    else if(url.indexOf("facebook") !== -1)
    {
      FACEBOOK++;
    }

    chrome.storage.local.get(["codeforces","facebook","time"], function(items){ 
        if(!items["codeforces"])
          items["codeforces"]=0;
        if(!items["facebook"])
          items["facebook"]=0;
        if(!items["time"])
          items["time"]=CURRENTTIME;
        if(CURRENTTIME-items["time"]>3600000)
        {
          //Reset Counters
          items["codeforces"]=0;
          items["facebook"]=0;
          items["time"]=CURRENTTIME;
        }
        //Needs a better check here
        else if(CURRENTTIME-items["time"]<=50)
        {
          CODEFORCES=0;
          FACEBOOK=0;
        }
        CODEFORCES=CODEFORCES+items["codeforces"];
        FACEBOOK=FACEBOOK+items["facebook"];
        chrome.storage.local.set({ "facebook": FACEBOOK ,"codeforces": CODEFORCES , "time" : CURRENTTIME}, function(){
        });
    });
    
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {  
  updateCounters(tabId, changeInfo, tab);
});

chrome.tabs.onCreated.addListener(function(tab) {         
});
