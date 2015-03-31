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
var URL = 'https://www.kimonolabs.com/api/7s0pa17w?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1';
// hackernew newest
//var URL = 'https://www.kimonolabs.com/api/d0i7qv8m?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1';
// ptt buytogether
//var URL = 'https://www.kimonolabs.com/api/dzbhe9r4?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy&&kimmodify=1'
var firstTime = true;

function refresh(force, vibrate) {
    loading.subtitle('Downloading');
    loading.body('Please wait...');
    if (firstTime) {
        loading.show();
    }
    ajax({ url: URL, type: 'json' }, function (json) {
        Vibe.vibrate('short');
        loading.subtitle('');
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

function createRefreshCallback(force, vibrate) {
    return function refresh_callback() {
        refresh(force, vibrate);
    };
}

refresh(true, true);
loading.on('click', 'select', createRefreshCallback(true, true));
Accel.on('tap', createRefreshCallback(true, true));
