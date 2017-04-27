function updateCounters(tabId, changeInfo, tab) {
    // Tab is still loading
    if (changeInfo.status!=='complete') {
      console.log(changeInfo);
      return ;
    }

    // Tab has been loaded completely 
    console.log(changeInfo.status);
    console.log('Tab id is: '+tabId);
    var url = tab.url;
    var tabIsCodeforces = (url.indexOf('codeforces') !== -1)? 1: 0;
    var tabIsFacebook = (url.indexOf('facebook') !== -1)? 1: 0;
    var currentPage = 'Irrelevant';
    if (tabIsCodeforces) {
      currentPage='codeforces';
    }
    else if (tabIsFacebook) {
      currentPage='facebook'; 
    }

    var noOfContextSwitches;
    var lastContext;
    var codeforcesTabIDs;
    var facebookTabIDs;
    
    // Get counters' values from chrome's storage
    chrome.storage.local.get(['noOfContextSwitches','lastContext','codeforcesTabIDs','facebookTabIDs'], function(items) { 
        noOfContextSwitches = (!items['noOfContextSwitches'])? 0: items['noOfContextSwitches'];
        lastContext = (!items['lastContext'])? 'Irrelevant': items['lastContext'];
        codeforcesTabIDs = (!items['codeforcesTabIDs'])? []: items['codeforcesTabIDs'];
        facebookTabIDs = (!items['facebookTabIDs'])? []: items['facebookTabIDs'];
  
        // Irrelevant website - Remove it from arrays of 
        if (currentPage==='Irrelevant') {
          // 1) Search for tabId in both arrays and remove tabId
          if (codeforcesTabIDs.indexOf(tabId) !==-1) {
            var indx = codeforcesTabIDs.indexOf(tabId);
            codeforcesTabIDs.splice(indx, 1);
          }
          else if (facebookTabIDs.indexOf(tabId) !==-1) {
            var indx = facebookTabIDs.indexOf(tabId);
            facebookTabIDs.splice(indx, 1);
          }
        } 

        else if (currentPage==='codeforces') {
          if (lastContext ==='facebook') {
            noOfContextSwitches += 1;
          }
          lastContext = 'codeforces';
          if (codeforcesTabIDs.indexOf(tabId) ===-1) {
            codeforcesTabIDs.push(tabId);
          }
          if (facebookTabIDs.indexOf(tabId) !==-1) {
            var indx = facebookTabIDs.indexOf(tabId);
            facebookTabIDs.splice(indx, 1);
          }
        }

        else {
          lastContext = 'facebook';
          if (facebookTabIDs.indexOf(tabId) ===-1) {
            facebookTabIDs.push(tabId);
          }
          if (codeforcesTabIDs.indexOf(tabId) !==-1) {
            var indx = codeforcesTabIDs.indexOf(tabId);
            codeforcesTabIDs.splice(indx, 1);
          } 
        }

        chrome.storage.local.set({ 'noOfContextSwitches':noOfContextSwitches,'lastContext':lastContext,
                                  'codeforcesTabIDs':codeforcesTabIDs,'facebookTabIDs':facebookTabIDs}, function(){
        });
  
    });  
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {  
  updateCounters(tabId, changeInfo, tab);
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  chrome.storage.local.get(['codeforcesTabIDs','facebookTabIDs'], function(items) { 
    codeforcesTabIDs = (!items['codeforcesTabIDs'])? []: items['codeforcesTabIDs'];
    facebookTabIDs = (!items['facebookTabIDs'])? []: items['facebookTabIDs'];
    if (codeforcesTabIDs.indexOf(tabId) !==-1) {
      var indx = codeforcesTabIDs.indexOf(tabId);
      codeforcesTabIDs.splice(indx, 1);
    } 
    if (facebookTabIDs.indexOf(tabId) !==-1) {
      var indx = facebookTabIDs.indexOf(tabId);
      facebookTabIDs.splice(indx, 1);
    } 
    chrome.storage.local.set({ 'codeforcesTabIDs':codeforcesTabIDs,'facebookTabIDs':facebookTabIDs}, function(){});
    
  });
});
