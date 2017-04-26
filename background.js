function updateCounters(tabId, changeInfo, tab) {
    // Tab is still loading
    if (changeInfo.status!=='complete')
    {
      console.log(changeInfo);
      return ;
    }

    // Tab has been loaded completely 
    console.log(changeInfo.status);
    console.log('Tab id is: '+tabId);
    var url = tab.url;
    var tabIsCodeforces = (url.indexOf('codeforces') !== -1)? 1: 0;
    var tabIsFacebook = (url.indexOf('facebook') !== -1)? 1: 0;
    var currentPage;
    // Irrelevant website
    if(tabIsCodeforces===0 && tabIsFacebook===0)
    {
      chrome.storage.local.set({'lastImportant': 'Irrelevant' , 'lastTabId': tabId}, function(){
        });
      return ;
    }
    else if(tabIsCodeforces)
    {
      currentPage='codeforces';
    }
    else
    {
      currentPage='facebook'; 
    }

    // Get counters' values from chrome's storage
    chrome.storage.local.get(['codeforces','facebook','lastTabId','lastImportant'], function(items){ 
        if(!items['codeforces'])
          items['codeforces']=0;
        if(!items['facebook'])
          items['facebook']=0;
        if(!items['lastTabId'])
          items['lastTabId']=-1;
        if(!items['lastImportant'])
          items['lastImportant']='Irrelevant';
        if(items['lastTabId']===tabId && items['lastImportant']===currentPage)
        {
          return ;
        }

        tabIsCodeforces=tabIsCodeforces+items['codeforces'];
        tabIsFacebook=tabIsFacebook+items['facebook'];
        chrome.storage.local.set({ 'facebook': tabIsFacebook ,'codeforces': tabIsCodeforces , 
                                    'lastTabId': tabId, 'lastImportant':currentPage}, function(){
        });
    });
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {  
  updateCounters(tabId, changeInfo, tab);
});

chrome.tabs.onCreated.addListener(function(tab) {         
});
