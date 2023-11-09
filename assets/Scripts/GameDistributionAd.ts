import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameDistributionAd')
export class GameDistributionAd extends Component {
    onLoad(){
        window["GD_OPTIONS"] = {
            "gameId": "[YOUR GD GAME ID HERE]",
            "onEvent": function(event) {
                switch (event.name) {
                    case "SDK_GAME_START":
                        // advertisement done, resume game logic and unmute audio
                        break;
                    case "SDK_GAME_PAUSE":
                        // pause game logic / mute audio
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

    GDShowAd(){
        if (typeof gdsk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
    }
}

