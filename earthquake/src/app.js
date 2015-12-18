/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var todayData = [];
var main = new UI.Card({
  title: 'EarthQuake',
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
    var menuItems = parseFeed(data, 5);
    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Today EarthQuake',
        items: menuItems
      }]
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    main.hide();
  },
  function(error) {
    // Failure!
    console.log('Failed fetching weather data: ' + error);
    main.body('Failed fetching data: ' + error);
});


var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    var time = data[i].earthquake.time;
    var magnitude = data[i].earthquake.hypocenter.magnitude;
    var scale = data[i].earthquake.maxScale;
    var place = data[i].earthquake.hypocenter.name;

    items.push({
      title:place+':震度'+convert(scale),
      subtitle:time
    });
    
    todayData.push({
      'time':time,
      'magnitude':magnitude,
      'scale':scale,
      'place':place,
    });
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


// main.on('click', 'up', function(e) {
//   var menu = new UI.Menu({
//     sections: [{
//       items: [{
//         title: 'Pebble.js',
//         icon: 'images/menu_icon.png',
//         subtitle: 'Can do Menus'
//       }, {
//         title: 'Second Item',
//         subtitle: 'Subtitle Text'
//       }]
//     }]
//   });
//   menu.on('select', function(e) {
//     console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
//     console.log('The item is titled "' + e.item.title + '"');
//   });
//   menu.show();
// });

// main.on('click', 'select', function(e) {
//   var wind = new UI.Window({
//     fullscreen: true,
//   });
//   var textfield = new UI.Text({
//     position: new Vector2(0, 65),
//     size: new Vector2(144, 30),
//     font: 'gothic-24-bold',
//     text: 'Text Anywhere!',
//     textAlign: 'center'
//   });
//   wind.add(textfield);
//   wind.show();
// });

// main.on('click', 'down', function(e) {
//   var card = new UI.Card();
//   card.title('A Card');
//   card.subtitle('Is a Window');
//   card.body('The simplest window type in Pebble.js.');
//   card.show();
// });