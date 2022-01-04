// background timer instance
var timer = new Timer();

// on startup, get port connection
var portFromTimer;

function connected(p) {
  console.log("connected");
  portFromTimer = p;
  portFromTimer.onMessage.addListener(buttonInput);
  timer.connected = true;
  portFromTimer.postMessage({type: "UPDATE_POMO_COUNTER", val: timer.pomosCompleted});
  portFromTimer.postMessage({type: "SET_COLOR", mode: timer.mode});
  if (timer.currentTime) {
    portFromTimer.postMessage({type: "TIME_UPDATE", time: timer.currentTime});
  } else {
    portFromTimer.postMessage({type: "TIME_UPDATE", time: timer.times[timer.mode] * 60});
  }
}

function buttonInput(command) {
  switch (command.type) {
    case "SWITCH":
      timer.mode = timer.modes[command.newMode];
      timer.reset();
      break;
    case "TIMER_START":
      timer.runTimer();
      break;
    case "TIMER_PAUSE":
      timer.endTimer();
      break;
    case "TIMER_RESET":
      timer.reset();
      break;
    case "TIMER_CHANGE_TIMES":
      for (let a in command.newTimes) {
        if (command.newTimes[a].match(/[0-9]+/)) {
          let num = parseInt(command.newTimes[a]);
          timer.times[a] = num;
        }
      }
      timer.reset();
      break;
  }
}

function disconnected(p) {
  timer.connected = false;
}

chrome.runtime.onConnect.addListener(connected);

chrome.runtime.onMessage.addListener(buttonInput);

// timer expired behavior
timer.intervalEndCommunicator = function() {
  async function playAlarm() {
    let audio = new Audio('alarm.wav');
    audio.play();
    await new Promise(r => setTimeout(r, 5000));
    audio.pause();
  }
  playAlarm();

  // change mode to new mode
  if (timer.mode === timer.modes.pomo) {
    timer.mode = timer.modes["break"];
    timer.pomosCompleted++;
    timer.reset();
  } else {
    timer.mode = timer.modes.pomo;
    timer.reset();
  }

  console.log(timer.mode);
  if (timer.connected) {
    portFromTimer.postMessage({type: "UPDATE_POMO_COUNTER", val: timer.pomosCompleted});
    portFromTimer.postMessage({type: "SET_COLOR", mode: timer.mode});
  }
}