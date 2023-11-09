import { _decorator, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, director, input, Input, EventMouse, KeyCode, EventKeyboard, Collider, Vec2, UITransform, rect, Graphics, EventTouch, sys, game } from 'cc';
const { ccclass, property } = _decorator;

import { GoldPool } from './GoldPool';
import { Pin } from './Pin';
import { GameOver } from './GameOver';

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
        type: Node
    })
    public ground: Node;
    @property({
        type: GameOver
    })
    public lblGameOver: GameOver;

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
        if (event.getButton() === 0 && !this.gameOver) {
            console.log("CLICKED");
            this.clickLocation = event.getUILocation();
            const uiTransform = this.pin.getComponent(UITransform).getBoundingBoxToWorld();
            //rect box = this.pin.getComponent(rect);
            
            //move pin
            if(!this.pin.isPulled && (uiTransform.contains(this.clickLocation))){
                console.log("CLICKED PIN");
                this.pin.movePin();
                this.pin.isPulled = true;
            } 
            // else if (this.isWin){
            //     director.resume();
            //     this.lblGameOver.hideGameWon();
            //     director.loadScene("level2");
            // } else if (!this.isWin && this.isOver){
            //     this.resetGame();
            // }
        }
    }

    //for mobile
    onTouchStart(event: EventTouch){
        this.touchLocation = event.getUILocation();
        const uiTransform = this.pin.getComponent(UITransform).getBoundingBoxToWorld();
        if(!this.pin.isPulled && (uiTransform.contains(this.touchLocation))){
            console.log("TOUCH PIN");
            this.pin.movePin();
            this.pin.isPulled = true;
        } 
        // else if (this.isWin){
        //     director.resume();
        //     this.lblGameOver.hideGameWon();
        //     director.loadScene("level2");
        // } else if (!this.isWin && this.isOver){
        //     this.resetGame();
        // }
    }

    startGame(){
        director.resume();
        director.preloadScene("level2", function () {});
    }

    resetGame(){
        this.isOver = false;
        this.isWin = false;
        this.goldPile.reset();
        this.pin.resetPin();
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
        }, 2);   
    }

    createGold(){
        //this.goldPile.addPool();
    }

    contactGround(){
        let collider = this.ground.getComponent(Collider2D);

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        this.goldPile.hitGround = true;
        
    }

    goldOnGroundCheck(){
        this.contactGround();

        if(this.goldPile.hitGround){
            this.isWin = true;
            this.lblGameOver.name = "win";
            this.gameOver();
        }
    }

    update(){
        if(!this.isOver){
            this.goldOnGroundCheck();
        }
    }

    loadNextLevel(){
        if(this.lblGameOver.name == "win"){
            director.resume();
            //this.lblGameOver.hideGameWon();
            this.lblGameOver.node.active = false;
            director.loadScene("level2");
        } else {
            this.lblGameOver.node.active = false;
            this.resetGame();
        }
        
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
}

