/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var todayData = [];
var main = new UI.Card({
  title: '地震情報',
  subtitle: today(),
  body: 'Fetching...',
});

main.show();

function today(){
  var date = new Date();
  var myYear = date.getFullYear();
  var myMonth = date.getMonth() + 1;
  var myDate = date.getDate();
  return myYear +'/'+ myMonth+'/'+myDate;
}


var URL = "http://api.p2pquake.com/v1/human-readable";
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    
    var menuItems = parseFeed(data);
    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: '地震情報',
        items: menuItems
      }]
    });
    
    //menu select
    resultsMenu.on('select', function(e) {
      var data = todayData[e.itemIndex];
      var description = '場所:'+data.place+'\nM'+data.magnitude+'\n震度:'+convert(data.scale)+'\n深さ:'+data.depth+'\n津波:'+data.tsunami;
  
       // Create the Card for detailed view
      var detailCard = new UI.Card({
        title:data.time,
        body: description
      });
      detailCard.show();
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    main.hide();
  },
  function(error) {
    // Failure!
    console.log('Failed fetching data: ' + error);
    main.body('Failed fetching data: ' + error);
});


var parseFeed = function(data) {
  var items = [];
  console.log(JSON.stringify(data));
  for(var i = 0; i < data.length; i++) {
    if (data[i].code == '551') {
      var time = data[i].earthquake.time;
      var magnitude = data[i].earthquake.hypocenter.magnitude;
      var scale = data[i].earthquake.maxScale;
      var place = data[i].earthquake.hypocenter.name;
      var depth = data[i].earthquake.hypocenter.depth;
      var wave = data[i].earthquake.domesticTsunami;
      items.push({
        title:time,
        subtitle:'震度'+convert(scale)+':'+place
      });
    
      todayData.push({
        'time':time,
        'magnitude':magnitude,
        'scale':scale,
        'place':place,
        'depth':depth,
        'tsunami':tsunami(wave)
      });
   }
  }
  
  // Finally return whole array
  return items;
};

function convert(scale){
  switch (scale) {
    case 0:
      return 0;
    case 10:
      return 1;
    case 20:
      return 2;
    case 30:
      return 3;
    case 40:
      return 4;
    case 45:
      return '5-';
    case 50:
      return 5;
    case 55:
      return '5+';
    case 60:
      return 6;
    case 70:
      return 7;
  }
}

function tsunami(wave){
  switch (wave) {
    case 'None':
      return 'なし';
    case 'Unknown':
      return '不明';
    case 'Checking':
      return '調査中';
    case 'NonEffective':
      return '若干の海面変動[被害の心配なし]';
    case 'Watch':
      return '津波注意報';
    case 'Warning':
      return '津波予報[種類不明]';
  }
  return '';
}

