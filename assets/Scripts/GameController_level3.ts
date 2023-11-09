import { _decorator, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, director, input, Input, EventMouse, KeyCode, EventKeyboard, Collider, Vec2, UITransform, rect, Graphics, EventTouch, Prefab, sys, game } from 'cc';
const { ccclass, property } = _decorator;

import { GoldPool } from './GoldPool';

import { GameOver } from './GameOver';
import { Pin_Diagonal } from './Pin_Diagonal';
import { RockPool } from './RockPool';

@ccclass('GameController_level3')
export class GameController_level3 extends Component {
    @property({
        type: GoldPool
    })
    public goldPile: GoldPool;

    @property({
        type: RockPool
    })
    public rockPile: RockPool;
    
    @property({
        type: Node
    })
    public ground: Node;

    @property({
        type: GameOver
    })
    public lblGameOver: GameOver;

    @property({
        type: Pin_Diagonal
    })
    public pin_topLeft: Pin_Diagonal;
    @property({
        type: Pin_Diagonal
    })
    public pin_botLeft: Pin_Diagonal;
    @property({
        type: Pin_Diagonal
    })
    public pin_botRight: Pin_Diagonal;

    
    public isOver: boolean;
    public isWin: boolean;
    

    onLoad(){
        this.initListener();
        this.resetGame();
    }

    initListener(){
        
        //input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        //phone
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    
    public clickLocation: Vec2;
    public touchLocation: Vec2;

    public goldCollider: Collider2D;

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0 && !this.isOver) {
            console.log("CLICKED");
            this.clickLocation = event.getUILocation();
            const pinTopLeftBox = this.pin_topLeft.getComponent(UITransform).getBoundingBoxToWorld();
            const pinBotLeftBox = this.pin_botLeft.getComponent(UITransform).getBoundingBoxToWorld();
            const pinBotRightBox = this.pin_botRight.getComponent(UITransform).getBoundingBoxToWorld();
            //rect box = this.pin.getComponent(rect);
            
            //move pin
            if(!this.pin_topLeft.isPulled && (pinTopLeftBox.contains(this.clickLocation))){

                console.log("CLICK TOP LEFT PIN");
                this.pin_topLeft.movePin();
                this.pin_topLeft.isPulled = true;

            } else if (!this.pin_botRight.isPulled && (pinBotRightBox.contains(this.clickLocation))){

                console.log("CLICK BOT RIGHT PIN");
                this.pin_botRight.movePin();
                this.pin_botRight.isPulled = true;
            } else if (!this.pin_botLeft.isPulled && (pinBotLeftBox.contains(this.clickLocation))){

                console.log("CLICK BOT LEFT PIN");
                this.pin_botLeft.movePin();
                this.pin_botLeft.isPulled = true;
            }
        } 
    }

    onTouchStart(event: EventTouch){
        //const target = event.target as Node;
        //this.touchLocation = target.getPosition();
        this.touchLocation = event.getUILocation();
        const pinTopLeftBox = this.pin_topLeft.getComponent(UITransform).getBoundingBoxToWorld();
        const pinBotLeftBox = this.pin_botLeft.getComponent(UITransform).getBoundingBoxToWorld();
        const pinBotRightBox = this.pin_botRight.getComponent(UITransform).getBoundingBoxToWorld();

        //move pin
        if(!this.pin_topLeft.isPulled && (pinTopLeftBox.contains(this.touchLocation))){

            console.log("TOUCH TOP LEFT PIN");
            this.pin_topLeft.movePin();
            this.pin_topLeft.isPulled = true;

        } else if (!this.pin_botRight.isPulled && (pinBotRightBox.contains(this.touchLocation))){

            console.log("TOUCH BOT RIGHT PIN");
            this.pin_botRight.movePin();
            this.pin_botRight.isPulled = true;
        } else if (!this.pin_botLeft.isPulled && (pinBotLeftBox.contains(this.touchLocation))){

            console.log("TOUCH BOT LEFT PIN");
            this.pin_botLeft.movePin();
            this.pin_botLeft.isPulled = true;
        }
    }
    
    startGame(){
        director.resume();
        director.preloadScene("level4", function () {});
    }

    resetGame(){
        this.isOver = false;
        this.goldPile.reset();
        this.rockPile.reset();
        this.pin_topLeft.resetPin();
        this.pin_botLeft.resetPin();
        this.pin_botRight.resetPin();
        this.lblGameOver.resetWinMidstPos();
        this.startGame();
    }

    contactGround(){
        let collider = this.ground.getComponent(Collider2D);

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactWithGround, this);
        }
    }

    contactRock(){
        //let collider = this.rockPile.getComponent(Collider2D);
        //let collider = this.rockPile.__prefab;
        

        for(let i=0; i<this.rockPile.rocks.length; i++){
            let rock = this.rockPile.rocks[i].getChildByName("imgRock");
            //console.log(rock);
            let collider = rock.getComponent(Collider2D);
            if(collider){
                collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactWithRock, this);
            }
        }
        //console.log(this.rockPile.rockPoolHome.size());
    }

    onBeginContactWithGround(selfCollider: Collider, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        if(otherCollider.tag == 1){
            this.goldPile.hitGround = true;
        }
    }

    onBeginContactWithRock(selfCollider: Collider, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        if(otherCollider.tag == 1){
            this.rockPile.hitGold = true;
        } 
    }

    goldOnGroundCheck(){
        this.contactGround();

        if(this.goldPile.hitGround){
            this.gameWon();
        }
    }

    goldOnRockCheck(){
        this.contactRock();

        if(this.rockPile.hitGold){
            this.gameLoss();
        }
    }

    update(){
        if(!this.isOver){
            this.goldOnRockCheck();
            this.goldOnGroundCheck();
        }
    }

    gameWon(){
        this.isOver = true;
        this.isWin = true;
        this.lblGameOver.name = "win";

        this.scheduleOnce(function() {
            // Here this refers to component
            //director.pause();
            this.lblGameOver.node.active = true;
            this.lblGameOver.loadWin();
        }, 2);   
    }

    gameLoss(){
        this.isOver = true;
        this.lblGameOver.name = "loss";

        this.scheduleOnce(function() {
            // Here this refers to component
            this.lblGameOver.node.active = true;
            this.lblGameOver.loadLose();
        }, 2);   
    }

    loadNextLevel(){
        if(this.lblGameOver.name == "win"){
            director.resume();
            //this.lblGameOver.hideGameWon();
            this.lblGameOver.node.active = false;
            director.loadScene("level4");
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

