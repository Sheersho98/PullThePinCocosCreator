import { _decorator, Component, director, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RockPool')
export class RockPool extends Component {
    @property({
        type:Prefab
    })
    public prefabRock = null;

    @property({
        type:Node
    })
    public rockPoolHome;

    @property
    rockCount: number = 0;


    public pool = new NodePool;
    public createRock;
    public hitGold: boolean;
    public rocks: Node[] = [];

    initPool(){
        this.hitGold = false;
        
        for(let i=0; i<this.rockCount; i++){
            this.createRock = instantiate(this.prefabRock);
            this.rockPoolHome.addChild(this.createRock);
            this.rocks.push(this.createRock);
            // if(i == 0){
            //     this.rockPoolHome.addChild(this.createRock);
            // } else {
            //     this.pool.put(this.createRock);
            // }
        }
        director.addPersistRootNode(this.rockPoolHome);
    }

    reset(){
        this.rockPoolHome.removeAllChildren();
        this.pool.clear();
        this.rocks.length = 0;
        this.initPool();
    }
}

