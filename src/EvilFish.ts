import { Game } from "./Game"
import * as PIXI from "pixi.js"
import '@pixi/math-extras'
import { ObservablePoint } from "pixi.js"

export class EvilFish extends PIXI.Sprite {

    swimSpeed:PIXI.Point
    game:Game

    constructor(game: Game) {
        super(game.pixi.loader.resources["fish"].texture!)
        this.game = game
        this.anchor.set(0.5)   
        // color matrix filter
        const filter = new PIXI.filters.ColorMatrixFilter()
        filter.hue(200, false)
        filter.predator(0.1, true)
        this.filters = [filter]

        this.swimSpeed = new PIXI.Point(-1, -1)
        this.position.set(800,400)
    }

    hitShark(){
        console.log("evil fish hits shark")
    }


    update(delta: number) {
        const mouseposition : PIXI.Point = this.game.pixi.renderer.plugins.interaction.mouse.global
        const direction = mouseposition.subtract(this.position).normalize()
        const progress = direction.multiplyScalar(3)
        
        this.position = this.position.add(progress) as ObservablePoint  
        
        const distance = mouseposition.subtract(this.position).magnitude()
        if(distance > 4) this.angle = (Math.atan2(direction.y, direction.x) * 180 / Math.PI) + 180

        this.flipFish(direction.x, distance)
    }

    flipFish(directionX: number, distance: number) {
        let flipFish = (directionX > 0 && distance > 4)
        if (flipFish) {
            this.scale.set(1, -1)
        } else {
            this.scale.set(1, 1)
        }
    }
}