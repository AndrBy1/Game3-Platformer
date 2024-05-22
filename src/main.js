// Andrew Byi
// 5/20/2024
//
// platformer game
//
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

let stage = 0;
let coinScore = 0;
let doubleJump = false;
let secondJump = false;

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1050,
    height: 750,
    scene: [Load, PlatformerLvl1, PlatformerLvl2, PlatformerLvl3, endLvl]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);