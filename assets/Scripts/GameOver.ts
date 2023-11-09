import { _decorator, Button, Component, game, Label, Node, sys, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    @property(Node) win_midst: Node = null;
    @property(Node) bg_win_resource_variant: Node = null;
    @property(Node) coin: Node = null;
    @property(Label) reward_status: Label = null;
    @property(Button) btnLevelCompleteOrReset: Button = null;

    public initWinMidstPos: Vec3;
    // @property({
    //     type: Label
    // })
    // public gameWon: Label;

    // @property({
    //     type: Label
    // })
    // public gameLoss: Label;

    // showGameWon(){
    //     this.gameWon.node.active = true;
    // }

    // hideGameWon(){
    //     this.gameWon.node.active = false;
    // }

    // showGameLoss(){
    //     this.gameLoss.node.active = true;
    // }

    // hideGameLoss(){
    //     this.gameLoss.node.active = false;
    // }

    loadWin(){
        this.reward_status.getComponent(Label).string = "Congratulations! You Win!";
        this.initWinMidstPos = this.win_midst.getPosition();

        tween(this.win_midst)
        .to(0.5, {position: new Vec3(0,this.win_midst.getPosition().y,0)})
        .start();

        this.btnLevelCompleteOrReset.getComponentInChildren(Label).string = "Next Level";

       // this.restartGame() ;
       console.log("node name",this.node.name);
    }

    loadLose(){
        this.reward_status.getComponent(Label).string = "Oppssss! You Lose!";
        this.initWinMidstPos = this.win_midst.getPosition();

        tween(this.win_midst)
        .to(0.5, {position: new Vec3(0,this.win_midst.getPosition().y,0)})
        .start();

        this.btnLevelCompleteOrReset.getComponentInChildren(Label).string = "Play Again";

        //this.bg_win_resource_variant.active = false;
        this.coin.active = false;
    }

    resetWinMidstPos(){
        if(this.initWinMidstPos != null){
            this.win_midst.setPosition(this.initWinMidstPos);
        }
    }
}

