import { _decorator, Component, Node, Contact2DType, Collider2D, IPhysics2DContact, director, input, Input, EventMouse, KeyCode, EventKeyboard, Collider, Vec2, UITransform, rect, Graphics, EventTouch, Prefab, sys, game, Button, AudioSource, SliderComponent } from 'cc';
const { ccclass, property } = _decorator;

import { GoldPool } from './GoldPool';

import { GameOver } from './GameOver';
import { Pin_Diagonal } from './Pin_Diagonal';
import { GameDistributionAd } from './GameDistributionAd';
import { GameManager } from './GameManager';

@ccclass('GameController_level3')
export class GameController_level4 extends Component {
    @property({
        type: GoldPool
    })
    public goldPile: GoldPool;

    @property({
        type: Node
    })
    public groundLeft: Node;
    @property({
        type: Node
    })
    public groundRight: Node;

    @property({
        type: GameOver
    })
    public lblGameOver: GameOver;

    @property({
        type: Pin_Diagonal
    })
    public pinLeft: Pin_Diagonal;
    @property({
        type: Pin_Diagonal
    })
    public pinRight: Pin_Diagonal;

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
    public isLose: boolean;

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
            //rect box = this.pin.getComponent(rect);
            
            //move pin
            if(!this.pinRight.isPulled && (pinRightBox.contains(this.clickLocation))){

                console.log("CLICK RIGHT PIN");
                this.pinRight.movePin();
                this.pinRight.isPulled = true;

            } else if (!this.pinLeft.isPulled && (pinLeftBox.contains(this.clickLocation))){

                console.log("CLICK LEFT PIN");
                this.pinLeft.movePin();
                this.pinLeft.isPulled = true;
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
        const pinLeftBox = this.pinLeft.getComponent(UITransform).getBoundingBoxToWorld();
        const pinRightBox = this.pinRight.getComponent(UITransform).getBoundingBoxToWorld();

        //move pin
        if(!this.pinRight.isPulled && (pinRightBox.contains(this.touchLocation))){

            console.log("TOUCH RIGHT PIN");
            this.pinRight.movePin();
            this.pinRight.isPulled = true;

        } else if (!this.pinLeft.isPulled && (pinLeftBox.contains(this.touchLocation))){

            console.log("TOUCH LEFT PIN");
            this.pinLeft.movePin();
            this.pinLeft.isPulled = true;
        }

        if(this.volumeControl.node.active){
            this.volumeControl.node.active = false;
        }
    }

    startGame(){
        director.resume();
    }

    resetGame(){
        this.isOver = false;
        this.isWin = false;
        this.isLose = false;
        this.goldPile.reset();
        this.pinLeft.resetPin();
        this.pinRight.resetPin();
        this.lblGameOver.resetWinMidstPos();
        this.startGame();
    }

    contactLeftGround(){
        let collider = this.groundLeft.getComponent(Collider2D);

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactWithLeftGround, this);
        }
    }

    contactRightGround(){
        let collider = this.groundRight.getComponent(Collider2D);

        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactWithRightGround, this);
        }
    }

    onBeginContactWithLeftGround(selfCollider: Collider, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        if(otherCollider.tag == 1){
            this.isLose = true;
        }
    }

    onBeginContactWithRightGround(selfCollider: Collider, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        
        if(otherCollider.tag == 1){
            this.goldPile.hitGround = true;
        }
    }

    goldOnRightGroundCheck(){
        this.contactRightGround();

        if(this.goldPile.hitGround){
            this.gameWon();
        }
    }

    goldOnLeftGroundCheck(){
        this.contactLeftGround();

        if(this.isLose){
            this.gameLoss();
        }
    }

    update(){
        if(!this.isOver){
            this.goldOnRightGroundCheck();
            this.goldOnLeftGroundCheck();
        }
    }

    gameWon(){
        this.isOver = true;
        this.isWin = true;
        this.lblGameOver.name = "win";

        this.scheduleOnce(function() {
            // Here this refers to component
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

