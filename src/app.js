/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui'),
    ajax = require('ajax');
    //Accel = require('ui/accel');
    //Vibe = require('ui/vibe');

//Accel.init();
var main = new UI.Card({
    scrollable: false, 
    title: 'Y! 財經        >>\n\nHackerNews>>\n\nPTT合購版 >>'
});

var loading = new UI.Card({
    scrollable: true, 
    //icon: 'IMAGES_YAHOO_STOCK_28X28_PNG',
    title: 'oHotNews',
    subtitle: '下載中',
    body: '稍等一下...',
    style: "small"
});
// yahoo hot news
//var URL = 'https://www.kimonolabs.com/api/7s0pa17w?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1';
// hackernew newest
//var URL = 'https://www.kimonolabs.com/api/d0i7qv8m?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1';
// ptt buytogether
//var URL = 'https://www.kimonolabs.com/api/dzbhe9r4?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1'
var url_list={"up": "https://www.kimonolabs.com/api/7s0pa17w?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1",
              "select": "https://www.kimonolabs.com/api/d0i7qv8m?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1",
              "down": "https://www.kimonolabs.com/api/dzbhe9r4?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1"
    };
var firstTime = true;
var current_state = "up";

function refresh(force, vibrate, btn) {
    if (btn!="up" && btn!="select" && btn!="down")
        btn=current_state;
    var news={"up": "Y! 財經", "select": "Hacker News", "down": "PTT合購版"};
    loading.subtitle('下載中');
    loading.body('稍等一下...\n'+news[btn]);
    if (firstTime) {
        loading.show();
    }
    var URL = url_list[btn];
    ajax({ url: URL, type: 'json' }, function (json) {
        //Vibe.vibrate('short');
        loading.subtitle(news[btn]);
        var statsData = json.results.result_list;
        var msgbody='';
        if (statsData.length > 0) {
            var showTopN = 15;
            for(var i=0; i<statsData.length && i<showTopN; i++) {
              msgbody += "Date: " + statsData[i].date.text + "\n";
              msgbody += "Title: " + statsData[i].title.text + "\n";
              msgbody += "\n";
            }
        }
        else {
            msgbody='啥, 沒新的新聞.';
        }
        loading.body(msgbody);
    },
    function (error) {
        //console.error('Error fetching stats: ', error);
        //loading.hide();
        loading.subtitle('哇, 失敗了!');
        loading.body('請再試一次');
    });
}

/*
function createRefreshCallback(force, vibrate, btn) {
    return function refresh_callback(btn) {
        refresh(force, vibrate, btn);
    };
}
*/
//refresh(true, true);
//loading.on('click', 'select', createRefreshCallback(true, true, current_state));
//Accel.on('tap', createRefreshCallback(true, true, current_state));
main.show();

main.on('click', function(e) {
    //var btn={0:"up", 1:"select", 2:"down"};
    var btn=e.button;
    console.log('pressed ' + btn);
    current_state = btn;
    refresh(true, true, btn);
});
/*
main.on('click', 'up', function(e) {
    var btn={0:"up", 1:"select", 2:"down"};
    current_state = btn[e.itemIndex];
    refresh(true, true, btn[e.itemIndex]);
});
main.on('click', 'select', function(e) {
    var btn={0:"up", 1:"select", 2:"down"};
    current_state = btn[e.itemIndex];
    refresh(true, true, btn[e.itemIndex]);
});

main.on('click', 'down', function(e) {
    var btn={0:"up", 1:"select", 2:"down"};
    current_state = btn[e.itemIndex];
    refresh(true, true, btn[e.itemIndex]);
});
  */      
/*
var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Y! 財經',
        icon: 'images/menu_icon.png',
      },
      {
        title: 'Hacker News',
        icon: 'images/menu_icon.png',
      },
       {
        title: 'PTT合購版',
        icon: 'images/menu_icon.png',
      }]
    }]
  });
  menu.on('select', function(e) {
    var btn={0:"up", 1:"select", 2:"down"};
    console.log(btn[e.itemIndex]);
    current_state = btn[e.itemIndex];
    //refresh(true, true, btn[e.itemIndex]);
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
*/