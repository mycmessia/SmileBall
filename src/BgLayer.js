var BgLayer = BaseLayer.extend({

    RECT_COUNT: 6,

    rectList: [],
    rectColorList: ["blue", "lightYellow", "yellow", "lightRed", "red", "purple"],

    ctor: function () {

        this._super();

        var size = cc.director.getWinSize();

        for (var i = 0; i < this.RECT_COUNT; i++)
        {
            this.rectList[i] = cc.LayerColor.create(GT.getBgColor(this.rectColorList[i]),
                                                    size.width, size.height / 6);

            this.rectList[i].attr({x: 0, y: i * size.height / 6});
            this.rectList[i].ignoreAnchorPointForPosition(true);
            this.addChild(this.rectList[i]);
        }

    }

});