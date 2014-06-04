var BaseLayer = cc.Layer.extend({

    tagCounter: 0,

    touchStart: {},

    ctor: function () {

        this._super();
    },

    getUniqueTag: function () {

        return this.tagCounter++;

    }

});