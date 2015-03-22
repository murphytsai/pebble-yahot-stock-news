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
    title: 'Y 財經快訊',
    subtitle: '下載中',
    body: '請稍後...',
    style: "small"
});

var URL = 'https://www.kimonolabs.com/api/7s0pa17w?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy';
var firstTime = true;

function refresh(force, vibrate) {
    loading.subtitle('下載中');
    loading.body('請稍後...');
    if (firstTime) {
        loading.show();
    }
    ajax({ url: URL, type: 'json' }, function (json) {
        Vibe.vibrate('short');
        loading.subtitle('');
        var statsData = json.results.yahoo_stock_hot_news;
        var msgbody='';
        if (statsData.length > 0) {
            var showTopN = 15;
            for(var i=0; i<statsData.length && i<showTopN; i++) {
              msgbody += "Date: " + statsData[i].date + "\n";
              msgbody += "Title: " + statsData[i].title.text + "\n";
              msgbody += "\n";
            }
        }
        else {
            msgbody='無最新快訊';
        }
        loading.body(msgbody);
    },
    function (error) {
        console.error('Error fetching stats: ', error);
        //loading.hide();
        loading.subtitle('下載失敗');
        loading.body('請再試一次');
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
