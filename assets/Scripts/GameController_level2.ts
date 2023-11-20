import { _decorator, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, director, input, Input, EventMouse, KeyCode, EventKeyboard, Collider, Vec2, UITransform, rect, Graphics, EventTouch, sys, game, Button, AudioSource, SliderComponent } from 'cc';
const { ccclass, property } = _decorator;

import { GoldPool } from './GoldPool';
import { Pin } from './Pin';
import { Pin_Vertical } from './Pin_Vertical';
import { GameOver } from './GameOver';
import { GameDistributionAd } from './GameDistributionAd';
import { GameManager } from './GameManager';

@ccclass('GameController')
export class GameController extends Component {
    @property({
        type: GoldPool
    })
    public goldPile: GoldPool;
    @property({
        type: Pin
    })
    public pin: Pin;
    @property({
        type: Pin_Vertical
    })
    public pinVertical: Pin_Vertical;
    @property({
        type: Node
    })
    public ground: Node;
    @property({
        type: GameOver
    })
    public lblGameOver: GameOver;


    @property({
        type: AudioSource
    })
    public bgm: AudioSource;

    @property({
        type: SliderComponent
    })
    public volumeControl: SliderComponent;

    public isOver: boolean;
    public isWin: boolean;

    onLoad(){
        this.initListener();
        this.resetGame();
    }

    initListener(){
        
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        //phone
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(Node.EventType.TOUCH_START, ()=> {
        //     if(this.isOver){
        //         this.resetGame();
        //     }
        // })
        //PC
        // this.node.on(Node.EventType.MOUSE_UP, ()=> {
        //     if(this.isOver){
        //         this.resetGame();
        //     }
        // })
    }
    //for testing purposes
    onKeyDown(event: EventKeyboard){
        switch(event.keyCode){
            case KeyCode.KEY_A:
                this.gameOver();
            break;
            case KeyCode.KEY_Q:
                this.resetGame();
        }
    }

    public clickLocation: Vec2;
    public touchLocation: Vec2;

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0 && !this.isOver) {
            console.log("CLICKED");
            this.clickLocation = event.getUILocation();
            const pinBox = this.pin.getComponent(UITransform).getBoundingBoxToWorld();
            const pinVerticalBox = this.pinVertical.getComponent(UITransform).getBoundingBoxToWorld();
            //rect box = this.pin.getComponent(rect);
            
            //move pin
            if(!this.pin.isPulled && (pinBox.contains(this.clickLocation))){

                console.log("CLICK PIN");
                this.pin.movePin();
                this.pin.isPulled = true;

            } else if (this.pin.isPulled && (!this.pinVertical.isPulled && (pinVerticalBox.contains(this.clickLocation)))){

                console.log("CLICK VERTICAL PIN");
                this.pinVertical.moveVerticalPin();
                this.pinVertical.isPulled = true;
                console.log("GAME WON");
                this.isWin = true;
                this.gameOver();

            }

            if(this.volumeControl.node.active){
                this.volumeControl.node.active = false;
            }
        }
    }

    onTouchStart(event: EventTouch){
        //const target = event.target as Node;
        //this.touchLocation = target.getPosition();
        this.touchLocation = event.getUILocation();
        const pinBox = this.pin.getComponent(UITransform).getBoundingBoxToWorld();
        const pinVerticalBox = this.pinVertical.getComponent(UITransform).getBoundingBoxToWorld();

        //move pin
        if(!this.pin.isPulled && (pinBox.contains(this.touchLocation))){

            console.log("TOUCH PIN");
            this.pin.movePin();
            this.pin.isPulled = true;

        } else if (this.pin.isPulled && (!this.pinVertical.isPulled && (pinVerticalBox.contains(this.touchLocation)))){

            console.log("TOUCH VERTICAL PIN");
            this.pinVertical.moveVerticalPin();
            this.pinVertical.isPulled = true;
            this.isWin = true;
            this.lblGameOver.name = "win";
            this.gameOver();

        }

        if(this.volumeControl.node.active){
            this.volumeControl.node.active = false;
        }
        // else if (this.isWin){
        //     director.resume();
        //     this.lblGameOver.hideGameWon();
        //     director.loadScene("level3");
        // } else if (!this.isWin && this.isOver){
        //     this.resetGame();
        // }
    }

    startGame(){
        director.resume();
    }

    resetGame(){
        this.isOver = false;
        this.goldPile.reset();
        this.pin.resetPin();
        this.pinVertical.resetVerticalPin();
        this.lblGameOver.resetWinMidstPos();
        this.startGame();
    }

    gameOver(){
        this.isOver = true;
        this.scheduleOnce(function() {
            // Here this refers to component
            //director.pause();
            this.lblGameOver.node.active = true;
            this.lblGameOver.loadWin();
            console.log("GAME OVER");
        }, 2);   
    }

    loadNextLevel(){
        //game.resume();
        if(this.lblGameOver.name == "win"){
            GameManager.gameManagerInstance.isWin = true;
        } 
        this.lblGameOver.node.active = false;
        this.node.getParent().destroyAllChildren();
        GameManager.gameManagerInstance.showAd();
    }

    showAd(){
        this.bgm.volume = 0;
        //this.gdAd.GDShowAd();
        //this.loadNextLevel();
        //director.pause();
    }
    
    quitGame(){
        if (sys.isNative) {
            // If the game is running on a native platform (e.g., mobile or desktop),
            // you can exit the game using the platform-specific method.
            game.end();
        } else {
            // If the game is running in a web browser, handle quitting accordingly.
            // You might show a confirmation dialog or navigate to another page.
            // For example, in a web game, you can redirect the player to your website's homepage.
            window.location.href = 'https://www.example.com';
        }
    }
    toggleVolumeSlider(){
        if(!this.volumeControl.node.active){
            this.volumeControl.node.active = true;
        } else {
            this.volumeControl.node.active = false;
        }
    }

    adjustVolume(){
        this.bgm.volume = this.volumeControl.progress;
    }
}

