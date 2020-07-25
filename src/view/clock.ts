import {c, h} from "ts-liveview";
import S from "s-js";

function getClockText() {
    return new Date().toLocaleTimeString()
}

let clock = S.root(() => S.data(getClockText()))
setInterval(() => {
    clock(getClockText())
}, 1000)

export function renderClock() {
    let clockText = clock()
    return c('.clock',
        h`<p class="clock">Server Clock: ${clockText}</p>`)
}
