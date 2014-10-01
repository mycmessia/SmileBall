cc.game.onStart = function(){

    cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {

        if (!GT.getRecord())
            GT.setRecord(0);

//        cc.log("GT.getRecord()" + GT.getRecord());

        GT.addResCache();

        GT.winSize = cc.director.getWinSize();

        GT.designSize = {width: 640, height: 960};

        GT.SCALE_RATIO = GT.winSize.width / GT.designSize.width;

//        cc.log(GT.SCALE_RATIO);

        GT.BASE_POS_Y = GT.winSize.height / GT.SCALE_RATIO;

        cc.director.runScene(new GameScene());

    }, this);
};
cc.game.run();