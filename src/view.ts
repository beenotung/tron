import {renderClock} from "./view/clock";
import {renderWorld} from "./view/world";
import {c, h} from "ts-liveview";

export function render() {
    return c('#app', h`<div id="app">
<h1>Tron</h1>
${renderClock()}
${renderWorld()}
</div>
`)
}
