import {c, h} from "ts-liveview";
import S from "s-js";

let msg = S.root(() => S.data(''))

type Cell = {
    type: 'space'
} | {
    type: 'wall'
} | {
    type: 'car'
    player: string
    vx: number
    vy: number
}

type World = Cell[][]

const Size = 16

function initialWorld(): World {
    let world: World = []
    for (let y = 0; y < Size; y++) {
        let line: Cell[] = []
        for (let x = 0; x < Size; x++) {
            line.push({type: 'space'})
        }
        world.push(line)
    }
    world[1][0] = {
        type: 'car',
        player: 'Alice',
        vx: 0,
        vy: 1,
    }
    world[0][0] = {
        type: 'car',
        player: 'Bob',
        vx: 1,
        vy: 0,
    }
    return world
}

function updateWorld() {
    // console.log('update world')
    let oldWorld: World = world()
    // console.log('old', oldWorld)
    let newWorld: World = oldWorld.map(line => line.map(cell => cell))
    for (let y = 0; y < oldWorld.length; y++) {
        let line = oldWorld[y]
        for (let x = 0; x < line.length; x++) {
            let cell = line[x]
            if (cell.type === "car") {
                let newX = x + cell.vx
                let newY = y + cell.vy
                // console.log('move car from', {x, y}, 'to', {newX, newY})
                let destCell = newWorld[newY]?.[newX]
                if (!destCell) {
                    console.log('out of range (hit wall)')
                    let oldMsg = msg()
                    let newMsg = `${oldMsg}
[${new Date().toLocaleTimeString()}] ${cell.player} has ran into void`
                    msg(newMsg)
                    newWorld[y][x] = {type: "wall"}
                    continue
                }
                newWorld[newY][newX] = cell
                newWorld[y][x] = {type: "wall"}
            }
        }
    }
    // console.log('new', newWorld)
    world(newWorld)
}

let world = S.root(() => S.data(initialWorld()))
setInterval(S.sample(() => updateWorld), 1000)

function renderDirection(cell: Cell): string {
    if (cell.type !== "car") {
        return ''
    }
    if (cell.vy > 0) {
        return 'v'
    }
    if (cell.vy < 0) {
        return ''
    }
    if (cell.vx < 0) {
        return '<'
    }
    if (cell.vx > 0) {
        return '>'
    }
}

export function renderWorld() {
    return c('.world', h`<div class="world">
<table>
  <tbody>
  ${world().map(line => `<tr>
    ${line.map(cell => `<td class="${cell.type}">${renderDirection(cell)}</td>`).join('')}
  </tr>`).join('')}
  </tbody>
  <tbody hidden>
  <tr>
    <td class="space"></td>
    <td class="space"></td>
    <td class="wall"></td>
    <td class="space"></td>
  </tr>
  <tr>
    <td class="space"></td>
    <td class="space"></td>
    <td class="wall"></td>
    <td class="space"></td>
  </tr>
  <tr>
    <td class="space"></td>
    <td class="space"></td>
    <td class="car"></td>
    <td class="space"></td>
  </tr>
  <tr>
    <td class="space"></td>
    <td class="space"></td>
    <td class="space"></td>
    <td class="space"></td>
  </tr>
  </tbody>
</table>
<p style="white-space: pre-wrap">${msg()}</p>
</div>`)
}
