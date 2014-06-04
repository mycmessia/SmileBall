var BtnSprite = cc.Sprite.extend({

    ctor: function (texture, rect) {

        this._super(texture, rect);

        this.ACTIVE_CHILD_TAG = 0;

    },

    touchDown: function (src) {

        var child = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(src));
        child.attr({
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });

        this.addChild(child, 0, this.ACTIVE_CHILD_TAG);

    },

    touchUp: function () {

        if (this.getChildByTag(this.ACTIVE_CHILD_TAG))
            this.removeChildByTag(this.ACTIVE_CHILD_TAG);

    }

});

BtnSprite.create = function (texture, rect) {

    var btnSprite = new BtnSprite(texture, rect);

    if (btnSprite)
        return btnSprite;

    return null;

};