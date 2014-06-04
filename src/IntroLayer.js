var IntroLayer = BaseLayer.extend({

    ctor: function () {

        this._super();

        var title = cc.LabelTTF.create("游戏说明", "黑体", 60);
        title.attr({x: 320, y: GT.BASE_POS_Y - 100});
        title.setColor(GT.getTxtColor("black"));
        this.addChild(title);

        var tip1 = cc.LabelTTF.create("1、5个同样颜色的球出现在一条线上即可消除，包括横向纵向和斜线" +
            "，白色球可以和任何颜色的球消除",
            "黑体", 40, cc.size(600, 0), cc.TEXT_ALIGNMENT_LEFT);
        tip1.attr({x: 320, y: GT.BASE_POS_Y - 200, anchorY: 1, anchorX: 0.5});
        tip1.setColor(GT.getTxtColor("black"));
        this.addChild(tip1);

        var tip2 = cc.LabelTTF.create("2、点击一个球它会微笑，这时再点击棋盘一个点，如果有路（球只能横竖走" +
            "）它会跳过去",
            "黑体", 40, cc.size(600, 0), cc.TEXT_ALIGNMENT_LEFT);
        tip2.attr({x: 320, y: GT.BASE_POS_Y - 400, anchorY: 1, anchorX: 0.5});
        tip2.setColor(GT.getTxtColor("black"));
        this.addChild(tip2);

        var tip3 = cc.LabelTTF.create("3、每回合结束后会随机在不同位置新出现3个球，当没有3个空位时游戏结束",
            "黑体", 40, cc.size(600, 0), cc.TEXT_ALIGNMENT_LEFT);
        tip3.attr({x: 320, y: GT.BASE_POS_Y - 570, anchorY: 1, anchorX: 0.5});
        tip3.setColor(GT.getTxtColor("black"));
        this.addChild(tip3);

        var tip4 = cc.LabelTTF.create("4、球运动时不能点击",
            "黑体", 40, cc.size(600, 0), cc.TEXT_ALIGNMENT_LEFT);
        tip4.attr({x: 320, y: GT.BASE_POS_Y - 740, anchorY: 1, anchorX: 0.5});
        tip4.setColor(GT.getTxtColor("black"));
        this.addChild(tip4);

        var goback = cc.LabelTTF.create("点击屏幕返回", "黑体", 40);
        goback.attr({x: 320, y: 150, anchorY: 1, anchorX: 0.5});
        goback.setColor(GT.getTxtColor("black"));
        this.addChild(goback);

        this.setAnchorPoint(cc.p(0, 0));
        this.setScale(GT.SCALE_RATIO);

    },

    onEnter: function () {

        this._super();

        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function () {

                return true;

            },

            onTouchEnded: function () {

                var runningScene = cc.director.getRunningScene();

                runningScene.removeChildByTag(INTRO_LAEYR);

                var welcomeLayer = new WelcomeLayer();

                runningScene.addChild(welcomeLayer, 0, WELCOME_LAYER);


            }
        });
        cc.eventManager.addListener(this._touchListener, GT.TOUCH_PRIORITY_9);

    },

    onExit: function() {
        this._super();
        cc.eventManager.removeListener(this._touchListener);
    }

});