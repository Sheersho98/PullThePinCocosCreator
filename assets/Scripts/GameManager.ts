import { _decorator, Component, director, instantiate, Node, Prefab, resources, sys } from 'cc';
import { GameDistributionAd } from './GameDistributionAd';
const { ccclass, property } = _decorator;

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

@ccclass('GameManager')
export class GameManager extends Component {
    level: Node;
    userLevel: number;
    isWin: boolean;
    static gameManagerInstance : GameManager = null;
    
    onLoad(){
        if(GameManager.gameManagerInstance == null){
            GameManager.gameManagerInstance = this;
        }
        this.setGameLevel(1);
        this.userLevel = this.getGameLevel();
        this.resetLevel();
    }

    getNewLevelNode(levelNumber: number) : Node{
        let strPrefabPath = "Prefabs/level" + this.getGameLevel();
        let instance: Node;
        resources.load(strPrefabPath, Prefab, (err, prefab) => {
            instance = instantiate(prefab);
            instance.name = "level";
            director.getScene().addChild(instance);
        });
        return instance;
    }

    public loadNextLevel(){
        if(this.level != null){
            //this.level.getComponent(GoldPool).reset();
            this.level.destroy();
        }
        if(this.isWin){
            //this.GDShowAd();
            this.node.pauseSystemEvents(true);
            this.setGameLevel(this.userLevel+1);
            this.userLevel = this.getGameLevel();
            this.isWin = false;
            this.level = this.getNewLevelNode(this.userLevel);
        } else {
            this.resetLevel();
        }
    }

    public resetLevel(){
        if(this.level != null){
            this.level.destroy();
        }
        this.level = this.getNewLevelNode(this.userLevel);
    }

    public showAd(){
        director.getScene().getChildByName("GameDistributionAd").getComponent(GameDistributionAd).GDShowAd();
    }

    getGameLevel() :number
    {
         const gameLevelString = sys.localStorage.getItem("PullThePin_Level");
         if (gameLevelString !== null && gameLevelString !== undefined) {
            const gameLevel= parseInt(gameLevelString, 10);
    
            if (!isNaN(gameLevel)) {
                return gameLevel;
            }
            else
            {
                this.setGameLevel(1);
                return gameLevel;
            }
        }
         //const gameLevel = parseInt(gameLevelString, 10);
        return null;
    }

    setGameLevel(gameLevelData:number) 
    {
        let gameLevel = gameLevelData;
        if(gameLevel>5)
        {
            gameLevel = randomIntFromInterval(1,5);;
        }
        sys.localStorage.setItem("PullThePin_Level", gameLevel.toString());
    }

    update(deltaTime: number) {
        
    }
}

