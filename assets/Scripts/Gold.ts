import { _decorator, Component, Node, Vec3, screen, UITransform } from 'cc';
const { ccclass, property } = _decorator;

const random = (min, max) => {
    //return Math.random() * (max - min) + min;
    return Math.random() * (max - min);
}

@ccclass('Gold')
export class Gold extends Component {
    
    @property({
        type: Node,
        tooltip: "Gold"
    })
    public gold: Node;

    public tempStartLocation: Vec3 = new Vec3(0, 0, 0);
    public scene = screen.windowSize;

    onLoad(){
        this.initPos();
    }

    initPos(){
        this.tempStartLocation.x = (this.gold.getComponent(UITransform).width);

        //let xGap = random(-145, 145);
        //let yGap = random(45, 145);
        let xGap = random(-45, 28);
        let yGap = random(-50, 35);

        this.tempStartLocation.x = xGap;
        this.tempStartLocation.y = yGap;

        this.gold.setPosition(this.tempStartLocation);

    }

    update(deltaTime){
        
    }
}






