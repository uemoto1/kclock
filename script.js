
var periodTalk = 1500; // 発表時間
var periodDiscussion = 300; // 質疑時間
var timeFirstBell = 1200; // 予鈴時間
var timeSecondBell = periodTalk;
var timeThirdBell = periodTalk + periodDiscussion;

var timeConsumed = 0; // 経過時間
var clockStartup; // 開始時刻

var flagFirstBell = true;
var flagSecondBell = true;
var flagThirdBell = true;
var flagStatus = false;

var bell1 = new Audio("bell1.wav");
var bell2 = new Audio("bell2.wav");
var bell3 = new Audio("bell3.wav");

function sec2mmss(sec) {
  mm = parseInt(sec / 60);
  ss = parseInt(sec % 60);
  return mm + ":" + ("00" + ss).substr(-2);
}

function mmss2sec(mmss) {
  temp = mmss.match(/([0-9]+):([0-9]+)/);
  if (temp)
    return parseInt(temp[1]) * 60 + parseInt(temp[2]);
  return 0;
}

function openSetting() {
  stop();
  $('#periodTalk').val(sec2mmss(periodTalk));
  $('#periodDiscussion').val(sec2mmss(periodDiscussion));
  $('#timeFirstBell').val(sec2mmss(timeFirstBell));
  $('#timeConsumed').val(sec2mmss(timeConsumed));
  $('#textInfo').val($('#info').text());
  $('#textTitle').val($('#title').text());
  $('#settingDialog').modal();
}

function applySetting() {
  periodTalk = mmss2sec($('#periodTalk').val());
  periodDiscussion = mmss2sec($('#periodDiscussion').val());
  timeFirstBell = mmss2sec($('#timeFirstBell').val());
  timeConsumed = mmss2sec($('#timeConsumed').val());
  $("#info").text($("#textInfo").val());
  $("#title").text($("#textTitle").val());
  setup();
  update();
}

function resize() {
  var size = Math.min(window.innerHeight, window.innerWidth);
  var head = (window.innerHeight - size) / 2;

  $('#state').css('top', head + size * 1 / 24.0);
  $('#time').css('top', head + size * 4 / 24.0);
  $('#info').css('top', head + size * 15 / 24.0);
  $('#title').css('top', head + size * 17 / 24.0);
  $('#control').css('top', head + size * 20 / 24.0);
  
  $('#state').css('font-size', size * 2 / 24.0);
  $('#time').css('font-size', size * 9 / 24.0);
  $('#info').css('font-size', size * 1.5 / 24.0);
  $('#title').css('font-size', size * 1 / 24.0);
  $('#control').css('height', size * 2 / 24.0);
  $('#control span').css('font-size', size * 2 / 24.0);
  
  $('#control span').css('margin', size * 1 / 24.0);
}

function reset() {
  stop();
  
  $("#start").removeClass("active");
  $("#stop").removeClass("active");
  $("#reset").addClass("active");
  timeConsumed = 0;
  
  setup();
  update();
}

function setup() {
  clockStartup = Date.now() - timeConsumed * 1000;
  timeSecondBell = periodTalk;
  timeThirdBell = periodTalk + periodDiscussion;
  flagFirstBell = (timeConsumed < timeFirstBell);
  flagSecondBell = (timeConsumed < timeSecondBell);
  flagThirdBell = (timeConsumed < timeThirdBell);
}

function start() {
  if (!flagStatus) {
    $("#stop").removeClass("active");
    $("#start").addClass("active");
    $("#reset").removeClass("active");
    flagStatus = true;
    setup();
    update();
  }
}

function stop() {
  if (flagStatus) {
    $("#stop").addClass("active");
    $("#start").removeClass("active");
    $("#reset").removeClass("active");
    flagStatus = false;
  }
}

function update() {
  timeConsumed = Math.round((Date.now() - clockStartup) / 1000);
  
  if (timeConsumed < timeFirstBell) {
    var sec = timeSecondBell - timeConsumed;
    $("#time").text(sec2mmss(sec));
    $("#state").text("TALK");
    
  } else if (timeConsumed < timeSecondBell) {
    var sec = timeSecondBell - timeConsumed;
    $("#time").text(sec2mmss(sec));
    $("#state").text("TALK");
    
    if (flagFirstBell) {bell1.play(); flagFirstBell = false;}
    
  } else if (timeConsumed < timeThirdBell) {
    var sec = timeThirdBell - timeConsumed;
    $("#time").text(sec2mmss(sec));
    $("#state").text("DISCUSSION");
    
    if (flagSecondBell) {bell2.play(); flagSecondBell = false;}

    
  } else {
    var sec = timeConsumed - timeThirdBell;
    $("#time").text("-" + sec2mmss(sec));
    $("#state").text("INTERMISSION");

    if (flagThirdBell) {bell3.play(); flagThirdBell = false;}
    
  }
  
  $("#time").toggleClass("warning", timeSecondBell < timeConsumed);
  
  if (flagStatus) setTimeout(update, 100);
  
  
  
  
}
