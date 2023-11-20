import { _decorator, Component, director, game, Node, Script } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameDistributionAd')
export class GameDistributionAd extends Component {

    onLoad(){
        window["GD_OPTIONS"] = {
            "gameId": "f983a5bbc32e45129298c271543f3bd9",
            "onEvent": function(event) {
                switch (event.name) {
                    case "SDK_GAME_START":
                        // advertisement done, resume game logic and unmute audio
                        //game.resume();
                        director.getScene().getChildByName("GameManager").getComponent(GameManager).loadNextLevel();
                        break;
                    case "SDK_GAME_PAUSE":
                        // pause game logic / mute audio
                        director.getScene().getChildByName("GameManager").pauseSystemEvents(true);
                        break;
                    case "SDK_GDPR_TRACKING":
                        // this event is triggered when your user doesn't want to be tracked
                        break;
                    case "SDK_GDPR_TARGETING":
                        // this event is triggered when your user doesn't want personalised targeting of ads and such
                        break;
                    case "SDK_REWARDED_WATCH_COMPLETE":
                        // this event is triggered when your user completely watched rewarded ad
                        break;
                    case "CONTENT_RESUME_REQUESTED":
                        //game.resume();
                        break;
                }
            },
        };
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://html5.api.gamedistribution.com/main.min.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'gamedistribution-jssdk'));
    }
    public GDShowAd() {
        console.log("GDSDK",window.gdsdk);
        if (typeof gdsdk !== 'undefined' && gdsdk.showBanner) {
            console.log("ad show");
            gdsdk.showBanner();
        }
        else {
            console.error("GameDistribution SDK not initialized or showAd function not available.");
        }
    }
}

