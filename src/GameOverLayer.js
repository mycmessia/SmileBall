var GameOverLayer = BaseLayer.extend({
    
    ctor: function (info) {

        this.showContinueBtn = info.showContinueBtn;

        this.touchBtnIndex = -1;

        this.RESTART_BTN = this.getUniqueTag();
        this.GOBACK_BTN = this.getUniqueTag();
        this.CONTINUE_BTN = this.getUniqueTag();
        
        this._super();

        var restartBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_restart.png"));
        restartBtn.attr({x: 320, y: GT.BASE_POS_Y - 420});
        this.addChild(restartBtn, 0, this.RESTART_BTN);

        var goBackBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_goback.png"));
        goBackBtn.attr({x: 320, y: GT.BASE_POS_Y - 560});
        this.addChild(goBackBtn, 0, this.GOBACK_BTN);

        if (this.showContinueBtn)
        {
            var continueBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_continue.png"));
            continueBtn.attr({x: 320, y: GT.BASE_POS_Y - 700});
            this.addChild(continueBtn, 0, this.CONTINUE_BTN);
        }

        this.setAnchorPoint(cc.p(0, 0));
        this.setScale(GT.SCALE_RATIO);

    },

    onEnter: function () {

        var that = this;

        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch) {

                that.touchStart.x = touch.getLocation().x / GT.SCALE_RATIO;
                that.touchStart.y = touch.getLocation().y / GT.SCALE_RATIO;

                if (that.touchStart.x >= 320 - 145 &&
                    that.touchStart.x <= 320 + 145 &&
                    that.touchStart.y >= GT.BASE_POS_Y - 420 - 40 &&
                    that.touchStart.y <= GT.BASE_POS_Y - 420 + 40)
                {
                    that.touchBtnIndex = 0;
                    that.getChildByTag(that.RESTART_BTN).touchDown("btn_restart_active.png");
                }
                else if (that.touchStart.x >= 320 - 145 &&
                         that.touchStart.x <= 320 + 145 &&
                         that.touchStart.y >= GT.BASE_POS_Y - 560 - 40 &&
                         that.touchStart.y <= GT.BASE_POS_Y - 560 + 40)
                {
                    that.touchBtnIndex = 1;
                    that.getChildByTag(that.GOBACK_BTN).touchDown("btn_goback_active.png");
                }
                else if (that.touchStart.x >= 320 - 145 &&
                         that.touchStart.x <= 320 + 145 &&
                         that.touchStart.y >= GT.BASE_POS_Y - 700 - 40 &&
                         that.touchStart.y <= GT.BASE_POS_Y - 700 + 40)
                {
                    if (that.showContinueBtn)
                    {
                        that.touchBtnIndex = 2;
                        that.getChildByTag(that.CONTINUE_BTN).touchDown("btn_continue_active.png");
                    }
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

                that.getChildByTag(that.RESTART_BTN).touchUp();
                that.getChildByTag(that.GOBACK_BTN).touchUp();

                if (that.showContinueBtn)
                    that.getChildByTag(that.CONTINUE_BTN).touchUp();

                if (that.touchBtnIndex == 0)
                {
                    runningScene.removeChildByTag(GAME_OVER_LAYER);
                    runningScene.removeChildByTag(SMILE_BALL_LAYER);

//                    cc.log(SmileBallLayer);

                    var smileBallLayer = new SmileBallLayer();

//                    cc.log(smileBallLayer.removeBallList);

                    runningScene.addChild(smileBallLayer, 0, SMILE_BALL_LAYER);
                }
                else if (that.touchBtnIndex == 1)
                {
                    runningScene.removeChildByTag(GAME_OVER_LAYER);
                    runningScene.removeChildByTag(SMILE_BALL_LAYER);

                    var welcomeLayer = new WelcomeLayer();

                    runningScene.addChild(welcomeLayer, 0, WELCOME_LAYER);
                }
                else if (that.touchBtnIndex == 2)
                {
                    if (that.showContinueBtn)
                    {
                        runningScene.removeChildByTag(GAME_OVER_LAYER);
                    }
                }
        }});
        cc.eventManager.addListener(this._touchListener, GT.TOUCH_PRIORITY_8);

    },

    onExit: function() {
        this._super();
        cc.eventManager.removeListener(this._touchListener);
    }

});