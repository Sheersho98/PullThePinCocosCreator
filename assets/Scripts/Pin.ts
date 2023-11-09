import { _decorator, Component, Node, input, Input, EventMouse, Graphics, Vec3, tween, easing, isDisplayStats } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pin')
export class Pin extends Component {
    
    @property({
        type: Pin
    })
    public pin: Node;

    @property
    moveToPositionX: number = 0;
    @property
    moveToTime: number = 0;
    @property
    originPositionX: number = 0;
    @property
    isPulled: boolean = false;

    public pinLocation: Vec3;

    onLoad(){
        this.initListener();
    }

    initListener(){
        //for pc
        //input.on(Input.EventType.MOUSE_UP, this.onMouseDown, this.pin);
    }

    // onMouseDown(event: EventMouse){
    //     switch(event.BU){
    //         case BUTTON_LEFT:
    //             this.gameOver();
    //         break;
    //         case KeyCode.KEY_Q:
    //             this.resetGame();
    //     }
    //     const pin = this.pin.getComponent(Graphics);
    //     pin.moveTo(385, 0);
    // }
    onMouseDown(event: EventMouse) {
        if (event.getButton() === 0) {
            console.log("TOUCH PIN");
            
            //move pin
            if(!this.isPulled){
                this.movePin();
                this.isPulled = true;
            }
        }
    }

    movePin(){
        tween(this.node.position).to(this.moveToTime, new Vec3(this.node.position.x + this.moveToPositionX, this.node.position.y, 0), {easing: "smooth",
            onUpdate: (target: Vec3, ratio: number) => {
                this.node.position = target;
            }
        })
        .start();
    }

    resetPin(){
        this.isPulled = false;
        this.pinLocation = new Vec3(this.originPositionX, this.node.position.y, 0);
        this.node.setPosition(this.pinLocation);
    }
}

