dagdealtimer();
setInterval(() => {
    dagdealtimer()
}, 1e3);
function dagdealtimer() {
    const timer = document.getElementById('dagdealtimer')
    let now = new Date().getTime();
    let end = new Date()
    end.setUTCHours(23)
    end.setUTCMinutes(0)
    end.setUTCSeconds(0)
    end = end.getTime();
    let timeleft = end - now;
    let hours = Math.floor(timeleft / 60 / 60 / 1000);
    timeleft = timeleft - hours * 60 * 60 * 1000;
    let minutes = Math.floor(timeleft / 60 / 1000) < 10 ? '0' + Math.floor(timeleft / 60 / 1000) : Math.floor(timeleft / 60 / 1000);
    timeleft = timeleft - minutes * 60 * 1000;
    let seconds = Math.floor(timeleft / 1000) < 10 ? '0' + Math.floor(timeleft / 1000) : Math.floor(timeleft / 1000);
    timer.innerHTML = `${hours}:${minutes}:${seconds}`;
} 