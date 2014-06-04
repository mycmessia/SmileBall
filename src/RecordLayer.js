var AboutLayer = BaseLayer.extend({

    ctor: function () {

        this._super();

        var title = cc.LabelTTF.create("最高纪录", "黑体", 60);
        title.attr({x: 320, y: GT.BASE_POS_Y - 100});
        title.setColor(GT.getTxtColor("black"));
        this.addChild(title);

        var record = GT.getRecord() ? GT.getRecord() : 0;

        var recordLabel = cc.LabelTTF.create("" + record, "黑体", 120);
        recordLabel.attr({x: 320, y: GT.BASE_POS_Y - 260});
        recordLabel.setColor(GT.getTxtColor("black"));
        this.addChild(recordLabel);

        var tip1 = cc.LabelTTF.create("如果你也对游戏开发充满热情，欢迎加入我们",
            "黑体", 40, cc.size(600, 0), cc.TEXT_ALIGNMENT_LEFT);
        tip1.attr({x: 320, y: GT.BASE_POS_Y - 450, anchorY: 1, anchorX: 0.5});
        tip1.setColor(GT.getTxtColor("black"));
        this.addChild(tip1);

        var tip2 = cc.LabelTTF.create("联系方式 qq: 1722782384",
            "黑体", 40, cc.size(600, 0), cc.TEXT_ALIGNMENT_LEFT);
        tip2.attr({x: 320, y: GT.BASE_POS_Y - 600, anchorY: 1, anchorX: 0.5});
        tip2.setColor(GT.getTxtColor("black"));
        this.addChild(tip2);

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

                runningScene.removeChildByTag(ABOUT_LAYER);

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