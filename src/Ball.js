var Ball = cc.Sprite.extend({

    ctor: function (texture, rect) {

        this.EXP_TAG = 0;

        this._super(texture, rect);

        this.container();

    },

    container: function () {

        var _color = "";
        var _row = -1;
        var _col = -1;

        this.setBallColor = function (str) {
            _color = str;
        };

        this.getBallColor = function () {
            return _color;
        };

        this.setRow = function (n) {
            _row = n;
        };

        this.getRow = function () {
            return _row;
        };

        this.setCol = function (n) {
            _col = n;
        };

        this.getCol = function () {
            return _col;
        };
    },

    smile: function (json) {

        if (this.getChildByTag(this.EXP_TAG))
            this.removeChildByTag(this.EXP_TAG);

        var expression = cc.Sprite.create(json.batch.getTexture(),
                                          cc.rect(GT.expPos.smile.x, GT.expPos.smile.y, 80, 80));
        expression.attr({x: 40, y: 40});
        this.addChild(expression, 0, this.EXP_TAG);

    },

    unSmile: function (json) {

        if (this.getChildByTag(this.EXP_TAG))
            this.removeChildByTag(this.EXP_TAG);

        var expression = cc.Sprite.create(json.batch.getTexture(),
                                          cc.rect(GT.expPos.unsmile.x, GT.expPos.unsmile.y, 80, 80));
        expression.attr({x: 40, y: 40});
        this.addChild(expression, 0, this.EXP_TAG);

    }

});

Ball.create = function (texture, rect) {

    var ball = new Ball(texture, rect);

    if (ball)
        return ball;

    return null;

};
