import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pin_Vertical')
export class Pin_Vertical extends Component {
    @property({
        type: Pin_Vertical
    })
    public pin: Node;

    @property
    moveToPositionY: number = 0;
    @property
    originPositionY: number = 0;
    @property
    moveToTime: number = 0;
    @property
    isPulled: boolean = false;

    public pinLocation: Vec3;

    moveVerticalPin(){
        tween(this.node.position).to(this.moveToTime, new Vec3(this.node.position.x, this.node.position.y + this.moveToPositionY, 0), {easing: "smooth",
            onUpdate: (target: Vec3, ratio: number) => {
                this.node.position = target;
            }
        })
        .start();
    }

    resetVerticalPin(){
        this.isPulled = false;
        this.pinLocation = new Vec3(this.node.position.x, this.originPositionY, 0);
        this.node.setPosition(this.pinLocation);
    }
}

