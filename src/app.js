/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui'),
    ajax = require('ajax'),
    Accel = require('ui/accel'),
    Vibe = require('ui/vibe');

Accel.init();
var loading = new UI.Card({
    scrollable: true, 
    //icon: 'IMAGES_YAHOO_STOCK_28X28_PNG',
    title: 'Hot News',
    subtitle: 'Downloading',
    body: 'Please wait...',
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
var current_state = "";

function refresh(force, vibrate, btn) {
    if (btn!="up" && btn!="select" && btn!="down")
        btn=current_state;
    var news={"up": "Yahoo Stock", "select": "Hacker News", "down": "PTT BuyTogether"};
    loading.subtitle('Downloading');
    loading.body('Please wait...'+news[btn]);
    if (firstTime) {
        loading.show();
    }
    var URL = url_list[btn];
    ajax({ url: URL, type: 'json' }, function (json) {
        Vibe.vibrate('short');
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
            msgbody='No News Updated';
        }
        loading.body(msgbody);
    },
    function (error) {
        console.error('Error fetching stats: ', error);
        //loading.hide();
        loading.subtitle('Download Failure!');
        loading.body('Please try it again');
    });
}

function createRefreshCallback(force, vibrate, btn) {
    return function refresh_callback(btn) {
        refresh(force, vibrate, btn);
    };
}

//refresh(true, true);
loading.on('click', 'select', createRefreshCallback(true, true, current_state));
Accel.on('tap', createRefreshCallback(true, true, current_state));
var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Yahoo Stock',
        icon: 'images/menu_icon.png',
      },
      {
        title: 'Hacker News',
        icon: 'images/menu_icon.png',
      },
       {
        title: 'PTT BuyTogether',
        icon: 'images/menu_icon.png',
      }]
    }]
  });
  menu.on('select', function(e) {
    var btn={0:"up", 1:"select", 2:"down"};
    //console.log(btn[e.itemIndex]);
    current_state = btn[e.itemIndex];
    refresh(true, true, btn[e.itemIndex]);
    //console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    //console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();