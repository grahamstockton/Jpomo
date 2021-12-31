// port to background
var port = browser.runtime.connect({name:"port-from-popup"});

// button inputs
document.body.addEventListener("click", function(e) {
    if (e.target.classList.contains("start")) {
        browser.runtime.sendMessage({type: "TIMER_START"});
    }
    else if (e.target.classList.contains("pause")) {
        browser.runtime.sendMessage({type: "TIMER_PAUSE"});
    }
    else if (e.target.classList.contains("reset")) {
        browser.runtime.sendMessage({type: "TIMER_RESET"});
    }
    else {
        console.error(e);
    }
});

// get times
port.onMessage.addListener(function(m) {
    try {
        document.getElementById("time-display").textContent = (Math.floor(m.time / 60) + "").padStart(2, "0") + ":" + (m.time % 60 + "").padStart(2,"0");
    } catch {
        document.getElementById("time-display").textContent = "ERROR";
    }
});