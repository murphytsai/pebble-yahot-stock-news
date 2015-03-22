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
    title: '財經火熱快訊',
    subtitle: 'Loading Yahoo Stock Stats',
    body: 'Please wait...'
});

var stats = new UI.Card({scrollable: true, icon: 'IMAGES_YAHOO_STOCK_28X28_PNG'}),
    statsVisible = false,
    historicalData = [];

var URL = 'https://www.kimonolabs.com/api/7s0pa17w?apikey=W4o2kwcFgqewg9lhJBkxiev5uZlIACoy';

function refresh(force, vibrate) {
    loading.show();
    ajax({ url: URL, type: 'json' }, function (json) {
        Vibe.vibrate('short');
        console.log('Stats refreshed.', JSON.stringify(json));
        var statsData = json.results.yahoo_stock_hot_news;
        stats.title(' Y 財經火熱快訊');
        var msgbody='';
        loading.hide();
        if (statsData.length > 0) {
            for(var i=0; i<statsData.length; i++) {
              statsData[i].title.text
              msgbody += "Date: " + statsData[i].date + "\n";
              msgbody += "Title: " + statsData[i].title.text + "\n";
              msgbody += "\n";
            }
            stats.body(msgbody);
            stats.show();
        }
        else {
            msgbody='無最新火熱快訊'
            stats.body(msgbody);
            stats.show();
        }
    },
    function (error) {
        var msgbody='無法取得火熱快訊, 有錯啦.'
        stats.title(' Y 財經火熱快訊出包了');
        stats.body(msgbody);
        stats.show();
        console.error('Error fetching stats: ', error);
    });
}

function createRefreshCallback(force, vibrate) {
    return function refresh_callback() {
        refresh(force, vibrate);
    };
}

refresh(true, true);
stats.on('click', 'select', createRefreshCallback(true, true));
Accel.on('tap', createRefreshCallback(true, true));
