import { _decorator, Component, Node, Skeleton, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DragonAnimation')
export class DragonAnimation extends Component {
    @property({
        type: sp.Skeleton
    })
    public mySkeleton: sp.Skeleton;
    
    onLoad(){
        this.mySkeleton.setAnimation(0, '1', true);
    }
}

