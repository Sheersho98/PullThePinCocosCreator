import { _decorator, Collider2D, Component, director, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

import { Gold } from './Gold';

@ccclass('GoldPool')
export class GoldPool extends Component {
    
    @property({
        type:Prefab
    })
    public prefabGold = null;

    @property({
        type:Node
    })
    public goldPoolHome;

    public pool = new NodePool;
    public createGold;
    public hitGround: boolean;
    public goldPieces: Node[] = [];

    initPool(){
        this.hitGround = false;
        let initCount = 14;
        
        for(let i=0; i<initCount; i++){
            this.createGold = instantiate(this.prefabGold);
            //this.createGold.initPos(this.node);
            this.goldPoolHome.addChild(this.createGold);
            this.goldPieces.push(this.createGold);
            // if(i == 0){
            //     this.goldPoolHome.addChild(this.createGold);
            // } else {
            //     this.pool.put(this.createGold);
            // }
        }
        //director.addPersistRootNode(this.goldPoolHome);
    }

    reset(){
        this.goldPoolHome.destroyAllChildren();
        this.pool.clear();
        this.initPool();
    }
}

