// background timer instance
var timer = new Timer();

// on startup, get port connection
var portFromTimer;

function connected(p) {
  portFromTimer = p;
  portFromTimer.onMessage.addListener(buttonInput);
  timer.connected = true;
  if (timer.currentTime) {
    portFromTimer.postMessage({time: timer.currentTime});
  } else {
    portFromTimer.postMessage({time: timer.times[timer.mode] * 60});
  }
}

function buttonInput(command, args={}) {
  switch (command.type) {
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
      for (let a in args) {
        timer.times[a] = args[a];
      }
  }
}

function disconnected(p) {
  timer.connected = false;
}

browser.runtime.onConnect.addListener(connected);

browser.runtime.onMessage.addListener(buttonInput);
