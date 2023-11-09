import { _decorator, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, director, input, Input, EventMouse, KeyCode, EventKeyboard, Collider, Vec2, UITransform, rect, Graphics, EventTouch, Prefab, Vec3, sys, game } from 'cc';
const { ccclass, property } = _decorator;

import { GoldPool } from './GoldPool';
import { Pin } from './Pin';
import { Pin_Vertical } from './Pin_Vertical';
import { GameOver } from './GameOver';

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

@ccclass('GameController_level5')
export class GameController_level5 extends Component {
    @property({
        type: GoldPool
    })
    public goldPile: GoldPool;

    @property({
        type: Pin
    })
    public pinLeft: Pin;
    @property({
        type: Pin
    })
    public pinRight: Pin;
    @property({
        type: Pin_Vertical
    })
    public pinVertical: Pin_Vertical;

    @property({
        type: Node
    })
    public stone: Node;

    @property({
        type: Node
    })
    public dragon: Node;

    @property({
        type: GameOver
    })
    public lblGameOver: GameOver;

    public isOver: boolean;
    public isWin: boolean;
    public isLose: boolean;

    public initStonePos: Vec3;
    public initDragonPos: Vec3;

    public nextLevel = randomIntFromInterval(1,5);

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

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0 && !this.isOver) {
            console.log("CLICKED");
            this.clickLocation = event.getUILocation();
            const pinLeftBox = this.pinLeft.getComponent(UITransform).getBoundingBoxToWorld();
            const pinRightBox = this.pinRight.getComponent(UITransform).getBoundingBoxToWorld();
            const pinVerticalBox = this.pinVertical.getComponent(UITransform).getBoundingBoxToWorld();
            //rect box = this.pin.getComponent(rect);
            
            //move pin
            if(!this.pinVertical.isPulled && (pinVerticalBox.contains(this.clickLocation))){

                console.log("CLICK VERTICAL PIN");
                this.pinVertical.moveVerticalPin();
                this.pinVertical.isPulled = true;

            } else if(this.pinVertical.isPulled && !this.pinRight.isPulled && !this.pinLeft.isPulled && (pinLeftBox.contains(this.clickLocation))){

                console.log("CLICK LEFT PIN");
                this.pinLeft.movePin();
                this.pinLeft.isPulled = true;

            } else if (this.pinVertical.isPulled && !this.pinLeft.isPulled && !this.pinRight.isPulled && (pinRightBox.contains(this.clickLocation))){

                console.log("CLICK RIGHT PIN");
                this.pinRight.movePin();
                this.pinRight.isPulled = true;
            }
        } 
    }

    onTouchStart(event: EventTouch){
        //const target = event.target as Node;
        //this.touchLocation = target.getPosition();
        this.touchLocation = event.getUILocation();
        const pinLeftBox = this.pinLeft.getComponent(UITransform).getBoundingBoxToWorld();
        const pinRightBox = this.pinRight.getComponent(UITransform).getBoundingBoxToWorld();
        const pinVerticalBox = this.pinVertical.getComponent(UITransform).getBoundingBoxToWorld();

        //move pin
        if(!this.pinVertical.isPulled && (pinVerticalBox.contains(this.touchLocation))){

            console.log("TOUCH VERTICAL PIN");
            this.pinVertical.moveVerticalPin();
            this.pinVertical.isPulled = true;

        } else if(this.pinVertical.isPulled && !this.pinRight.isPulled && !this.pinLeft.isPulled && (pinLeftBox.contains(this.touchLocation))){

            console.log("TOUCH LEFT PIN");
            this.pinLeft.movePin();
            this.pinLeft.isPulled = true;

        } else if (this.pinVertical.isPulled && !this.pinLeft.isPulled && !this.pinRight.isPulled && (pinRightBox.contains(this.touchLocation))){

            console.log("TOUCH RIGHT PIN");
            this.pinRight.movePin();
            this.pinRight.isPulled = true;
        }
    }

    startGame(){
        director.resume();
        this.initStonePos = this.stone.getPosition();
        this.initDragonPos = this.dragon.getPosition();
        director.preloadScene("level"+this.nextLevel, function () {});
    }

    resetGame(){
        this.isOver = false;
        this.isWin = false;
        this.isLose = false;
        this.goldPile.reset();
        this.pinLeft.resetPin();
        this.pinRight.resetPin();
        this.pinVertical.resetVerticalPin();
        if(this.initStonePos != null && this.initDragonPos != null){
            this.stone.setPosition(this.initStonePos);
            this.dragon.setPosition(this.initDragonPos);
        }
        this.lblGameOver.resetWinMidstPos();
        this.startGame();
    }

    contactStone(){
        let collider = this.stone.getComponent(Collider2D);

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactWithStone, this);
        }
    }

    contactDragon(){
        let collider = this.dragon.getComponent(Collider2D);

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactWithDragon, this);
        }
    }

    onBeginContactWithStone(selfCollider: Collider, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        if(otherCollider.tag == 1){
            this.isLose = true;
        }
    }

    onBeginContactWithDragon(selfCollider: Collider, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        if(otherCollider.tag == 1){
            this.goldPile.hitGround = true;
        }
    }

    goldOnDragonCheck(){
        this.contactDragon();

        if(this.goldPile.hitGround){
            this.gameWon();
        }
    }

    goldOnStoneCheck(){
        this.contactStone();

        if(this.isLose){
            this.gameLoss();
        }
    }

    update(){
        if(!this.isOver){
            this.goldOnDragonCheck();
            this.goldOnStoneCheck();
        }
    }

    gameWon(){
        this.isOver = true;
        this.isWin = true;
        this.lblGameOver.name = "win";

        this.scheduleOnce(function() {
            this.lblGameOver.node.active = true;
            this.lblGameOver.loadWin();
        }, 2);   
    }

    gameLoss(){
        this.isOver = true;
        this.lblGameOver.name = "lose";

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
            director.loadScene("level"+this.nextLevel);
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

