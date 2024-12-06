export class Timer {
    constructor(seconds) {
        this.totalSeconds = seconds;
        this.timeLeft = seconds;
        this.timerId = null;
    }

    start(onTick) {
        if (this.timerId) return;

        this.timerId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                onTick();
            } else {
                this.stop();
            }
        }, 1000);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    getTimeLeft() {
        return this.timeLeft;
    }

    getTimeString() {
        const hours = Math.floor(this.timeLeft / 3600);
        const minutes = Math.floor((this.timeLeft % 3600) / 60);
        const seconds = this.timeLeft % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        return `${minutes}m ${seconds}s`;
    }
}