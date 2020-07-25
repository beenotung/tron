import {minifyView, sampleInSRoot, startServer, viewToHTML} from "ts-liveview";
import {Session} from "ts-liveview/session";
import {Request, Response} from "ts-liveview/types/server";
import {PrimitiveView} from "ts-liveview/types/view";
import {Component} from "ts-liveview/h";
import {render} from "./view";
import {renderClock} from "./view/clock";
import {renderWorld} from "./view/world";

function createSession(session: Session): Session | void {
    session.live(renderClock)
    session.live(renderWorld)
    return session
}

function initialRender(req: Request, res: Response): PrimitiveView | Component {
    let root = render()
    return minifyView(root)
}

startServer({
    port: 3000,
    createSession,
    primusOptions: {
        parser: 'JSON',
        transformer: "engine.io"
    },
    heads: [
        `<meta charset="UTF-8">
  <title>Tron</title>
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <script src="/primus/primus.js"></script>
  <style>
    table {border-collapse: collapse}
    td {
      width: 1em;
      height: 1em;
      text-align: center;
      vertical-align: middle;
    }
    td.space {
      background-color: black;
    }
    td.wall {
      background-color: cyan;
    }
    td.car {
      background-color: crimson;
    }
  </style>`,
    ],
    initialRender,
})
