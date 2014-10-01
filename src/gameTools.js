var GT = {

    designSize: {width: 640, height: 960},
    winSize: {width: 0, height: 0},

    MOVE_DIS: 10,

    SCALE_RATIO: 0,

    BALL_COLORS: 7,

    BASE_POS_Y: 0,

    TOUCH_PRIORITY_9: 9,
    TOUCH_PRIORITY_8: 8,

    BOARD_COL: 8,
    BOARD_ROW: 8,

    RECORD: 0,                                  //use for set record

    addResCache: function () {

        cc.spriteFrameCache.addSpriteFrames(res.btn_sheet_plist, res.btn_sheet_png);

    },

    calcTimer: function (fn, fnName) {

        var sumLoops = 1000;

        var start = Date.now();

        for (var i = 0; i < sumLoops; i++)
        {
            fn();
        }

        var during = Date.now() - start;

//        cc.log((fnName || "本程序1000次耗时") + during + "毫秒");

    },

    container: function () {

        var _tag = 0;

        this.getUniqueTag = function () {

            return _tag++;

        };

    },

    getTxtColor: function (str) {

        switch (str)
        {
            case "white":
                return cc.color(255, 255, 255, 255);
            case "black":
                return cc.color(0, 0, 0, 255);
            case "bg_blue":
                return cc.color(67, 146, 203);
            case "grey":
                return cc.color(240, 239, 239);

        }

    },

    getBgColor: function (str) {

        switch (str)
        {
            case "blue":
                return cc.color(67, 146, 203, 255);
            case "lightYellow":
                return cc.color(255, 220, 150, 255);
            case "yellow":
                return cc.color(255, 200, 100, 255);
            case "lightRed":
                return cc.color(249, 144, 148, 255);
            case "red":
                return cc.color(239, 105, 102, 255);
            case "purple":
                return cc.color(153, 70, 112, 255);
        }
    },

    createBall: function (info) {

        var pos = null;
        var size = {width: 80, height: 80};

        if (typeof info.arg == "number")
        {
            var n = Math.floor(Math.random() * info.arg) + 1;

            var ball = null;

            if (n > this.BALL_COLORS)
                return ball;

            switch (n)
            {
                case 1:
                    pos = GT.ballPos.blue;
                    ball = Ball.create(info.batch.getTexture(),
                                       cc.rect(pos.x, pos.y, size.width, size.height));
                    ball.setBallColor("blue");
                    break;
                case 2:
                    pos = GT.ballPos.yellow;
                    ball = Ball.create(info.batch.getTexture(),
                                       cc.rect(pos.x, pos.y, size.width, size.height));
                    ball.setBallColor("yellow");
                    break;
                case 3:
                    pos = GT.ballPos.purple;
                    ball = Ball.create(info.batch.getTexture(),
                                       cc.rect(pos.x, pos.y, size.width, size.height));
                    ball.setBallColor("purple");
                    break;
                case 4:
                    pos = GT.ballPos.green;
                    ball = Ball.create(info.batch.getTexture(),
                                       cc.rect(pos.x, pos.y, size.width, size.height));
                    ball.setBallColor("green");
                    break;
                case 5:
                    pos = GT.ballPos.pink;
                    ball = Ball.create(info.batch.getTexture(),
                                       cc.rect(pos.x, pos.y, size.width, size.height));
                    ball.setBallColor("pink");
                    break;
                case 6:
                    pos = GT.ballPos.red;
                    ball = Ball.create(info.batch.getTexture(),
                                       cc.rect(pos.x, pos.y, size.width, size.height));
                    ball.setBallColor("red");
                    break;
                case 7:
                    pos = GT.ballPos.white;
                    ball = Ball.create(info.batch.getTexture(),
                                       cc.rect(pos.x, pos.y, size.width, size.height));
                    ball.setBallColor("white");
                    break;
            }
        }
        else if (typeof info.arg == "string")
        {
            pos = GT.ballPos[info.arg];
            ball = Ball.create(info.batch.getTexture(),
                               cc.rect(pos.x, pos.y, size.width, size.height));
            ball.setBallColor(info.arg);
        }

        ball.attr({x: 0, y: 0, anchorX:0, anchorY:0});
        if (info.expression == "smile")
            ball.smile({batch: info.batch});
        else if (info.expression != "none")
            ball.unSmile({batch: info.batch});
        return ball;
    },

    getRecord: function () {
        return cc.sys.localStorage.getItem(this.RECORD);
    },

    setRecord:function (n) {
        cc.sys.localStorage.setItem(this.RECORD, n);
    }
};

GT.container();

GT.ballPos = {
    blue: {x: 0, y: 0},
    green: {x: 80, y: 0},
    pink: {x: 160, y: 0},
    purple: {x: 0, y: 80},
    red: {x: 80, y: 80},
    white: {x: 160, y:80},
    yellow: {x: 0, y: 160},
    point: {x: 240, y: 160}
};

GT.expPos = {
    smile: {x: 80, y: 160},
    unsmile: {x: 160, y: 160}
};

var BG_LAYER = GT.getUniqueTag();
var SMILE_BALL_LAYER = GT.getUniqueTag();
var WELCOME_LAYER = GT.getUniqueTag();
var GAME_OVER_LAYER = GT.getUniqueTag();
var INTRO_LAEYR = GT.getUniqueTag();
var ABOUT_LAYER = GT.getUniqueTag();