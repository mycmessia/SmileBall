var WelcomeLayer = BaseLayer.extend({

    ctor: function () {

        this.batch = null;
        this.BG_BALL_COUNT = 10;

        this.touchBtnIndex = -1;

        this.START_BTN = this.getUniqueTag();
        this.INTRO_BTN = this.getUniqueTag();
        this.RECORD_BTN = this.getUniqueTag();

        this._super();

        this.createBgBall();

        var logo = cc.Sprite.create(res.logo_png);
        logo.attr({x: 320, y: GT.BASE_POS_Y - 190});
        this.addChild(logo);

        var startBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_start.png"));
        startBtn.attr({x: 320, y: GT.BASE_POS_Y - 420});
        this.addChild(startBtn, 0, this.START_BTN);

        var introBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_intro.png"));
        introBtn.attr({x: 320, y: GT.BASE_POS_Y - 560});
        this.addChild(introBtn, 0, this.INTRO_BTN);

        var recordBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_record.png"));
        recordBtn.attr({x: 320, y: GT.BASE_POS_Y - 700});
        this.addChild(recordBtn, 0, this.RECORD_BTN);

        var version = cc.LabelTTF.create("Ver 1.0 beta", "黑体", 36);
        version.attr({x: 20, y: 20, anchorX:0, anchorY:0});
        version.setColor(GT.getTxtColor("black"));
        this.addChild(version);

        this.setAnchorPoint(cc.p(0, 0));
        this.setScale(GT.SCALE_RATIO);

    },

    onEnter: function () {

        this._super();

        var that = this;

        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch) {

                that.touchStart.x = touch.getLocation().x / GT.SCALE_RATIO;
                that.touchStart.y = touch.getLocation().y / GT.SCALE_RATIO;

                if (that.touchStart.x >= 320 - 145 &&
                    that.touchStart.x <= 320 + 145 &&
                    that.touchStart.y >= GT.BASE_POS_Y - 420 - 40 &&
                    that.touchStart.y <= GT.BASE_POS_Y - 420 + 40)
                {
                    that.touchBtnIndex = 0;
                    that.getChildByTag(that.START_BTN).touchDown("btn_start_active.png");
                }
                else if (that.touchStart.x >= 320 - 145 &&
                         that.touchStart.x <= 320 + 145 &&
                         that.touchStart.y >= GT.BASE_POS_Y - 560 - 40 &&
                         that.touchStart.y <= GT.BASE_POS_Y - 560 + 40)
                {
                    that.touchBtnIndex = 1;
                    that.getChildByTag(that.INTRO_BTN).touchDown("btn_intro_active.png");
                }
                else if (that.touchStart.x >= 320 - 145 &&
                         that.touchStart.x <= 320 + 145 &&
                         that.touchStart.y >= GT.BASE_POS_Y - 700 - 40 &&
                         that.touchStart.y <= GT.BASE_POS_Y - 700 + 40)
                {
                    that.touchBtnIndex = 2;
                    that.getChildByTag(that.RECORD_BTN).touchDown("btn_record_active.png");
                }

                return true;

            },

            onTouchMoved: function (touch) {

                var touchMove = {};

                touchMove.x = touch.getLocation().x / GT.SCALE_RATIO;
                touchMove.y = touch.getLocation().y / GT.SCALE_RATIO;

                if (Math.abs(touchMove.x - that.touchStart.x) > GT.MOVE_DIS ||
                    Math.abs(touchMove.y - that.touchStart.y) > GT.MOVE_DIS)
                {
                    that.touchBtnIndex = -1;
                }

            },

            onTouchEnded: function () {

                var runningScene = cc.director.getRunningScene();

                that.getChildByTag(that.START_BTN).touchUp();

                that.getChildByTag(that.INTRO_BTN).touchUp();

                that.getChildByTag(that.RECORD_BTN).touchUp();

                if (that.touchBtnIndex == 0)
                {
                    runningScene.removeChildByTag(WELCOME_LAYER);

                    var smileBallLayer = new SmileBallLayer();

                    runningScene.addChild(smileBallLayer, 0, SMILE_BALL_LAYER);
                }
                else if (that.touchBtnIndex == 1)
                {
                    runningScene.removeChildByTag(WELCOME_LAYER);

                    var introLayer = new IntroLayer();

                    runningScene.addChild(introLayer, 0, INTRO_LAEYR);
                }
                else if (that.touchBtnIndex == 2)
                {
                    runningScene.removeChildByTag(WELCOME_LAYER);

                    var aboutLayer = new AboutLayer();

                    runningScene.addChild(aboutLayer, 0, ABOUT_LAYER);
                }


            }
        });
        cc.eventManager.addListener(this._touchListener, GT.TOUCH_PRIORITY_9);

    },

    onExit: function() {
        this._super();
        cc.eventManager.removeListener(this._touchListener);
    },

    createBgBall: function () {

        this.batch = cc.SpriteBatchNode.create(
            res.ball_sheet_png, this.BG_BALL_COUNT
        );
        this.batch.attr({
            x: 0, y: 0,
            anchorX: 0, anchorY: 0
        });
        this.addChild(this.batch);

        for (var i = 0; i < this.BG_BALL_COUNT; i++)
        {
            var ball = GT.createBall({
                arg: GT.BALL_COLORS,
                expression: "none",
                batch: this.batch
            });

            if (ball)
            {
                ball.attr({
                    x: Math.random() * 640,
                    y: GT.BASE_POS_Y / this.BG_BALL_COUNT * i,
                    anchorX: 0.5,
                    anchorY: 0.5
                });
                ball.setScale(Math.random() * 2 + 0.4);

                this.batch.addChild(ball);
            }
        }

    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var bgLayer = new BgLayer();
        this.addChild(bgLayer, 0, BG_LAYER);

        var welcomeLayer = new WelcomeLayer();
        this.addChild(welcomeLayer, 0, WELCOME_LAYER);
    }
});