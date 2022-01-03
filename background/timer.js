class Timer {
    constructor() {
        this.modes = new Object({
            pomo: "pomo",
            break: "break",
            long_break: "long_break"
        });
        this.times = new Object({
            pomo: 25,
            break: 5,
            long_break: 15
        });
        this.mode = this.modes["pomo"];
        this.connected = false;
        this.currentTime = this.times[this.mode] * 60;
        this.pomosCompleted = 0;
        this.intervalTimer;
        this.intervalEndCommunicator = function () { return; };
    }

    changeMode(newMode) {
        if (this.times.hasOwnProperty(newMode)) {
            this.mode = newMode;
        }
    }

    changeTime(mode, newTime) {
        this.times["pomo"] = newTime;
    }

    runTimer(startTime = null) {
        if (startTime !== null) {
            this.currentTime = startTime;
        }

        // in case we already had one
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
        }

        // this and setinterval are not friendly
        var self = this;
        var a = setInterval(function() {
            self.currentTime--;
            if (self.currentTime <= 0) { 
                self.intervalEndCommunicator();
                clearInterval(a);
                return; 
            }
            if (self.connected) {
                try {
                    portFromTimer.postMessage({type: "TIME_UPDATE", time: timer.currentTime});
                } catch {
                    self.connected = false;
                }
            }
        }, 1000);
        this.intervalTimer = a;
    }

    endTimer() {
        clearInterval(this.intervalTimer);
    }

    reset() {
        clearInterval(this.intervalTimer);
        this.currentTime = this.times[this.mode] * 60;
        portFromTimer.postMessage({type: "TIME_UPDATE", time: timer.currentTime});
    }
}
