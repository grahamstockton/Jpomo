// port to background
var port = browser.runtime.connect({name:"port-from-popup"});

// button inputs
document.body.addEventListener("click", function(e) {
    // mode controls
    if (e.target.classList.contains("selector-pomo")) {
        browser.runtime.sendMessage({type: "SWITCH", newMode: "pomo"});
    } else if (e.target.classList.contains("selector-break")) {
        browser.runtime.sendMessage({type: "SWITCH", newMode: "break"});
    } else if (e.target.classList.contains("selector-break-long")) {
        browser.runtime.sendMessage({type: "SWITCH", newMode: "long_break"});
    }
    // timer controls
    else if (e.target.classList.contains("start")) {
        browser.runtime.sendMessage({type: "TIMER_START"});
    }
    else if (e.target.classList.contains("pause")) {
        browser.runtime.sendMessage({type: "TIMER_PAUSE"});
    }
    else if (e.target.classList.contains("reset")) {
        browser.runtime.sendMessage({type: "TIMER_RESET"});
    }
});

// get times
port.onMessage.addListener(function(m) {
    if (m.type === "TIME_UPDATE") {
        try {
            document.getElementById("time-display").textContent = (Math.floor(m.time / 60) + "").padStart(2, "0") + ":" + (m.time % 60 + "").padStart(2,"0");
        } catch {
            document.getElementById("time-display").textContent = "ERROR";
        }
    } else if (m.type === "UPDATE_POMO_COUNTER") {
        document.getElementById("completed-counter").textContent = "Pomos completed: " + m.val;
    }
});

// form submit for time change
document.getElementById("change-times-submit").onclick = function() {
    browser.runtime.sendMessage({
        type: "TIMER_CHANGE_TIMES",
        newTimes: {
            pomo: document.getElementById("pomo-time").value,
            break: document.getElementById("break-time").value,
            long_break: document.getElementById("break-long-time").value
        }
    });
}