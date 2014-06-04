var SmileBallLayer = BaseLayer.extend({

    ctor: function () {

        this.PAUSE_BTN = this.getUniqueTag();

        this.MAX_COL = GT.BOARD_COL;
        this.MAX_ROW = GT.BOARD_ROW;

        this.CELL_WIDTH = 80;
        this.CELL_HEIGHT = 80;

        this.NUM_CAN_REMOVE = 5;

        this.NEW_BALL_COUNT = 3;

        this.FADE_IN_TIME = 0.3;
        this.FADE_OUT_TIME = 0.3;

        this.board = [];
        this.boardPos = {x: 0, y: 0};

        this.cellSize = {width: 80, height: 80};
        this.score = 0;

        this.touchRow = -1;
        this.touchCol = -1;
        this.touchBtnIndex = -1;

        this.isCanTouch = true;
        this.smileBall = null;

        this.removeBallList = [];
        this.nextBallList = [];

        this.batch = null;

        this._super();

        this.SCORE_NUM = this.getUniqueTag();

        var scoreLabel = cc.LabelTTF.create("分数", "黑体", 40);
        scoreLabel.attr({x: 120, y: GT.BASE_POS_Y - 75});
        scoreLabel.setColor(GT.getTxtColor("black"));
        this.addChild(scoreLabel);

        var nextLabel = cc.LabelTTF.create("次回出现", "黑体", 40);
        nextLabel.attr({x: 360, y: GT.BASE_POS_Y - 75});
        nextLabel.setColor(GT.getTxtColor("black"));
        this.addChild(nextLabel);

        var scoreNum = cc.LabelTTF.create(this.score + "", "黑体", 85);
        scoreNum.attr({x: 120, y: GT.BASE_POS_Y - 165});
        scoreNum.setColor(GT.getTxtColor("black"));
        this.addChild(scoreNum, 0, this.SCORE_NUM);

//        var restartBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_restart.png"));
//        restartBtn.attr({x: 170, y: GT.BASE_POS_Y - 250});
//        restartBtn.setScale(1.2);
//        this.addChild(restartBtn, 0, this.RESTART_BTN);
//
//        var goBackBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_restart.png"));
//        goBackBtn.attr({x: 470, y: GT.BASE_POS_Y - 250});
//        goBackBtn.setScale(1.2);
//        this.addChild(goBackBtn, 0, this.GOBACK_BTN);

        var pauseBtn = BtnSprite.create(cc.spriteFrameCache.getSpriteFrame("btn_pause.png"));
        pauseBtn.attr({x: 585, y: GT.BASE_POS_Y - 55});
        this.addChild(pauseBtn, 0, this.PAUSE_BTN);

        this.initBeginBall();

        this.showNextBall();

        this.scheduleUpdate();
        this.setAnchorPoint(cc.p(0, 0));
        this.setScale(GT.SCALE_RATIO);
    },

    update: function () {

        this.isCanTouch = true;

        for (var i = 0; i < this.MAX_COL; i++)
        {
            for (var j = 0; j < this.MAX_ROW; j++)
            {
                if (this.board[i][j].sprite && this.board[i][j].sprite.getNumberOfRunningActions() > 0)
                {
                    this.isCanTouch = false;
                    return null;
                }
            }
        }

    },

    onEnter: function () {

        this._super();
        var that = this;

        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch) {

                if (!that.isCanTouch)
                    return false;

                that.touchBtnIndex = -1;
                that.touchCol = -1;
                that.touchRow = -1;

                that.touchStart.x = touch.getLocation().x / GT.SCALE_RATIO;
                that.touchStart.y = touch.getLocation().y / GT.SCALE_RATIO;

                var touchBoardPos = {

                    x: that.touchStart.x - that.boardPos.x,
                    y: that.touchStart.y - that.boardPos.y

                };

                that.touchRow = Math.floor(touchBoardPos.y / that.cellSize.height);
                that.touchCol = Math.floor(touchBoardPos.x / that.cellSize.width);

                if (that.touchStart.x >= 585 - 145 &&
                    that.touchStart.x <= 585 + 145 &&
                    that.touchStart.y >= GT.BASE_POS_Y - 55 - 35 &&
                    that.touchStart.y <= GT.BASE_POS_Y - 55 + 35)
                {
                    that.touchBtnIndex = 0;
                    that.getChildByTag(that.PAUSE_BTN).touchDown("btn_pause_active.png");
                }

                if (that.touchRow >= that.MAX_ROW  || that.touchCol >= that.MAX_COL)
                {
                    that.touchRow = -1;
                    that.touchCol = -1;
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
                    that.touchRow = -1;
                    that.touchCol = -1;
                    that.touchBtnIndex = -1;
                }

            },

            onTouchEnded: function () {

                that.getChildByTag(that.PAUSE_BTN).touchUp();

                if (that.touchCol != -1 && that.touchRow != -1)
                {
                    if (that.board[that.touchCol][that.touchRow].sprite == null && that.smileBall)
                    {
                        /* 已经有smile的ball应该运动到点击位置 */
                        that.searchPath({
                            col: that.smileBall.col,
                            row: that.smileBall.row
                        }, {
                            col: that.touchCol,
                            row: that.touchRow
                        });
                    }
                    else if (that.board[that.touchCol][that.touchRow].sprite)
                    {
                        if (that.smileBall)
                        {
                            that.smileBall.setLocalZOrder(0);
                            that.smileBall.unSmile({batch: that.batch});
                        }

                        /* 没有smile的ball应该让点击位置的ball成为smileBall */
                        that.smileBall = that.board[that.touchCol][that.touchRow].sprite;
                        that.smileBall.setLocalZOrder(9);
                        that.smileBall.col = that.touchCol;
                        that.smileBall.row = that.touchRow;
                        that.smileBall.smile({batch: that.batch});
                    }
                }
                else if (that.touchBtnIndex == 0)
                {
                    var runningScene = cc.director.getRunningScene();

                    var gameOverLayer = new GameOverLayer({
                        showContinueBtn: true
                    });

                    runningScene.addChild(gameOverLayer, 0, GAME_OVER_LAYER);
                }

            }
        });
        cc.eventManager.addListener(this._touchListener, GT.TOUCH_PRIORITY_9);

    },

    onExit: function() {
        this._super();
        cc.eventManager.removeListener(this._touchListener);
    },

    initBeginBall: function () {

        this.MAX_ROW = Math.floor(
                (this.getChildByTag(this.SCORE_NUM).getPosition().y - this.cellSize.height / 2) /
                this.cellSize.height
        );

        this.batch = cc.SpriteBatchNode.create(
            res.ball_sheet_png,
            this.MAX_ROW * this.MAX_COL * 4
        );
        this.batch.attr({
            x: 0, y: 0,
            anchorX: 0, anchorY: 0
        });
        this.addChild(this.batch);

        for (var i = 0; i < this.MAX_COL; i++)
        {
            this.board[i] = [];

            for (var j = 0; j < this.MAX_ROW; j++)
            {
                this.board[i][j] = {
                    sprite: null,
                    isVisited: false
                };

                var pos = cc.Sprite.create(this.batch.getTexture(),
                                           cc.rect(GT.ballPos.point.x, GT.ballPos.point.y, 10, 10));
                pos.attr({
                    x: this.boardPos.x + i * this.CELL_WIDTH + this.CELL_WIDTH / 2,
                    y: this.boardPos.y + j * this.CELL_HEIGHT + this.CELL_HEIGHT / 2
                });
                pos.setLocalZOrder(-1);
                pos.setScale(1.5);
                this.batch.addChild(pos);

                var ball = GT.createBall({
                    arg: GT.BALL_COLORS * 10,
                    batch: this.batch
                });

                if (ball)
                {
                    this.board[i][j].sprite = ball;
                    ball.setCol(i);
                    ball.setRow(j);
                    ball.attr({
                        x: this.boardPos.x + i * this.CELL_WIDTH,
                        y: this.boardPos.y + j * this.CELL_HEIGHT,
                        anchorX: 0,
                        anchorY: 0
                    });
                    this.batch.addChild(ball);
                }
            }
        }

        for (var i = 0; i < this.MAX_COL; i++)
        {
            for (var j = 0; j < this.MAX_ROW; j++)
            {
                if (this.board[i][j].sprite)
                {
                    this.checkAllDirections(i, j);
                }
            }
        }

        this.removeBall();

    },

    showNextBall: function () {

        for (var i = 0; i < this.nextBallList.length; i++)
        {
            this.nextBallList[i].removeFromParent();
        }

        this.nextBallList.length = 0;

        for (var i = 0; i < this.NEW_BALL_COUNT; i++)
        {
            this.nextBallList[i] = GT.createBall({arg: GT.BALL_COLORS, batch: this.batch});
            this.nextBallList[i].attr({
                x: 260 + i * this.cellSize.width * 1.1,
                y: GT.BASE_POS_Y - 160,
                anchorX: 0,
                anchorY: 0.5
            });
            this.batch.addChild(this.nextBallList[i]);
        }

    },

    addNewBall: function () {

        var that = this;
        var posList = [];
        var posChosenList = [];
        var col = -1;
        var row = -1;
        
        for (var i = 0; i < this.MAX_COL; i++)
        {
            for (var j = 0; j < this.MAX_ROW; j++)
            {
                if (this.board[i][j].sprite == null)
                {
                    posList.push({col: i, row: j});
                }
            }
        }

        if (posList.length < this.NEW_BALL_COUNT)
        {
            this.handleGameOver();
            return null;
        }
        
        for (var i = 0; i < this.NEW_BALL_COUNT; i++)
        {
            var n = Math.floor(Math.random() * posList.length);

            posChosenList[i] = posList[n];

            posList.splice(n, 1);

            col = posChosenList[i].col;
            row = posChosenList[i].row;

            this.board[col][row].sprite = GT.createBall({
                arg: this.nextBallList[i].getBallColor(),
                batch: this.batch
            });
            this.board[col][row].sprite.setCol(col);
            this.board[col][row].sprite.setRow(row);
            this.board[col][row].sprite.attr({
                x: this.boardPos.x + col * this.CELL_WIDTH,
                y: this.boardPos.y + row * this.CELL_HEIGHT,
                anchorX: 0,
                anchorY: 0,
                opacity: 0
            });
            this.board[col][row].sprite.runAction(cc.FadeIn.create(this.FADE_IN_TIME));
            this.batch.addChild(this.board[col][row].sprite);
        }
        
        for (var i = 0; i < posChosenList.length; i++)
        {
            col = posChosenList[i].col;
            row = posChosenList[i].row;
            
            this.checkAllDirections(col, row);
        }

        this.scheduleOnce(function () {

            this.removeBall(function () {

                if (that.isGameOver())
                {
                    that.handleGameOver();
                }

            });

        }, this.FADE_IN_TIME);
    },

    isCanAdd: function (col, row) {

        for (var i = 0; i < this.removeBallList.length; i++)
        {
            if (this.removeBallList[i].sprite.getCol() == col &&
                this.removeBallList[i].sprite.getRow() == row)
            {
                return false;
            }
        }

        return true;
    },

    checkHorizontal: function (col, row) {

        var oldLength = this.removeBallList.length;
        var sum = 1;
        var color = this.board[col][row].sprite.getBallColor();

        if (this.isCanAdd(col, row))
        {
            this.removeBallList.push(this.board[col][row]);
        }

        /* left */
        var newCol = col - 1;
        while (newCol >= 0 &&
               this.board[newCol][row].sprite &&
               (this.board[newCol][row].sprite.getBallColor() == color ||
               this.board[newCol][row].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(newCol, row))
            {
                this.removeBallList.push(this.board[newCol][row]);
            }

            sum++;
            newCol--;
        }

        /* right */
        newCol = col + 1;
        while (newCol < this.MAX_COL &&
               this.board[newCol][row].sprite &&
               (this.board[newCol][row].sprite.getBallColor() == color ||
               this.board[newCol][row].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(newCol, row))
            {
                this.removeBallList.push(this.board[newCol][row]);
            }

            sum++;
            newCol++;
        }

        if (sum < this.NUM_CAN_REMOVE)
        {
            this.removeBallList.length = oldLength;
        }

    },

    checkVertical: function (col, row) {

        var oldLength = this.removeBallList.length;
        var sum = 1;
        var color = this.board[col][row].sprite.getBallColor();

        if (this.isCanAdd(col, row))
        {
            this.removeBallList.push(this.board[col][row]);
        }

        /* up */
        var newRow = row - 1;
        while (newRow >= 0 &&
               this.board[col][newRow].sprite &&
               (this.board[col][newRow].sprite.getBallColor() == color ||
               this.board[col][newRow].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(col, newRow))
            {
                this.removeBallList.push(this.board[col][newRow]);
            }

            sum++;
            newRow--;
        }

        /* down */
        newRow = row + 1;
        while (newRow < this.MAX_ROW &&
               this.board[col][newRow].sprite &&
               (this.board[col][newRow].sprite.getBallColor() == color ||
               this.board[col][newRow].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(col, newRow))
            {
                this.removeBallList.push(this.board[col][newRow]);
            }

            sum++;
            newRow++;
        }

        if (sum < this.NUM_CAN_REMOVE)
        {
            this.removeBallList.length = oldLength;
        }

    },

    checkSkewLeft: function (col, row) {

        var oldLength = this.removeBallList.length;
        var sum = 1;
        var color = this.board[col][row].sprite.getBallColor();

        if (this.isCanAdd(col, row))
        {
            this.removeBallList.push(this.board[col][row]);
        }

        var newRow = row - 1;
        var newCol = col - 1;
        while (newRow >= 0 &&
               newCol >= 0 &&
               this.board[newCol][newRow].sprite &&
               (this.board[newCol][newRow].sprite.getBallColor() == color ||
               this.board[newCol][newRow].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(newCol, newRow))
            {
                this.removeBallList.push(this.board[newCol][newRow]);
            }

            sum++;
            newRow--;
            newCol--;
        }

        newRow = row + 1;
        newCol = col + 1;
        while (newRow < this.MAX_ROW &&
               newCol < this.MAX_COL &&
               this.board[newCol][newRow].sprite &&
               (this.board[newCol][newRow].sprite.getBallColor() == color ||
               this.board[newCol][newRow].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(newCol, newRow))
            {
                this.removeBallList.push(this.board[newCol][newRow]);
            }

            sum++;
            newRow++;
            newCol++;
        }

        if (sum < this.NUM_CAN_REMOVE)
        {
            this.removeBallList.length = oldLength;
        }

    },

    checkSkewRight: function (col, row) {

        var oldLength = this.removeBallList.length;
        var sum = 1;
        var color = this.board[col][row].sprite.getBallColor();

        if (this.isCanAdd(col, row))
        {
            this.removeBallList.push(this.board[col][row]);
        }

        var newRow = row - 1;
        var newCol = col + 1;

        while (newRow >= 0 &&
               newCol < this.MAX_COL &&
               this.board[newCol][newRow].sprite &&
               (this.board[newCol][newRow].sprite.getBallColor() == color ||
               this.board[newCol][newRow].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(newCol, newRow))
            {
                this.removeBallList.push(this.board[newCol][newRow]);
            }

            sum++;
            newRow--;
            newCol++;
        }

        newRow = row + 1;
        newCol = col - 1;
        while (newRow < this.MAX_ROW &&
               newCol >= 0 &&
               this.board[newCol][newRow].sprite &&
               (this.board[newCol][newRow].sprite.getBallColor() == color ||
               this.board[newCol][newRow].sprite.getBallColor() == "white"))
        {
            if (this.isCanAdd(newCol, newRow))
            {
                this.removeBallList.push(this.board[newCol][newRow]);
            }

            sum++;
            newRow++;
            newCol--;
        }

        if (sum < this.NUM_CAN_REMOVE)
        {
            this.removeBallList.length = oldLength;
        }

    },

    checkAllDirections: function (col, row) {

        if (this.board[col][row].sprite.getBallColor() == "white")
        {
            for (var i = -1; i <= 1; i++)
            {
                for (var j = -1; j <= 1; j++)
                {
                    if (i == 0 && j == 0)
                        continue;

                    if (col + i >= this.MAX_COL || col + i < 0 ||
                        row + j >= this.MAX_ROW || row + j < 0)
                    {
                        continue;
                    }

                    var sprite = this.board[col + i][row + j].sprite;

                    if (sprite)
                    {
                        var multiple = 1;

                        while (sprite.getBallColor() == "white")
                        {
                            multiple++;

                            if (col + i * multiple == 0 && col + j * multiple == 0)
                                break;

                            if (col + i * multiple >= this.MAX_COL || col + i * multiple < 0 ||
                                row + j * multiple >= this.MAX_ROW || row + j * multiple < 0)
                            {
                                break;
                            }

                            if (this.board[col + i * multiple][row + j * multiple].sprite)
                                sprite = this.board[col + i * multiple][row + j * multiple].sprite;
                        }

                        this.board[col][row].sprite.setBallColor(sprite.getBallColor());

//                        cc.log("白色球变色做检查");

                        this.checkHorizontal(col, row);
                        this.checkVertical(col, row);
                        this.checkSkewLeft(col, row);
                        this.checkSkewRight(col, row);
                    }
                }
            }

            this.board[col][row].sprite.setBallColor("white");
        }
        else
        {
            this.checkHorizontal(col, row);
            this.checkVertical(col, row);
            this.checkSkewLeft(col, row);
            this.checkSkewRight(col, row);
        }

    },

    removeBall: function (callBack) {

        this.setScore();

        if (this.removeBallList.length == 0)
        {
            if (callBack)
            {
                callBack();
            }
        }
        else
        {
            for (var i = 0; i < this.removeBallList.length; i++)
            {
                this.removeBallList[i].sprite.runAction(cc.FadeOut.create(this.FADE_OUT_TIME));
                this.removeBallList[i].sprite.getChildByTag(0).runAction(cc.FadeOut.create(this.FADE_OUT_TIME));
            }

            this.scheduleOnce(function () {

                for (var i = 0; i < this.removeBallList.length; i++)
                {
                    this.removeBallList[i].sprite.removeFromParent();
                    this.removeBallList[i].sprite = null;
                }

                this.removeBallList.length = 0;

                if (callBack)
                {
                    callBack();
                }

            }, this.FADE_OUT_TIME);
        }

    },

    resetIsVisited: function () {

        for (var i = 0; i < this.MAX_COL; i++)
        {
            for (var j = 0; j < this.MAX_ROW; j++)
            {
                this.board[i][j].isVisited = false;
            }
        }

    },

    searchPath: function (start, dest) {

        var queue = [];
        var head = 0;
        var tail = 0;
        var path = [];

        function enqueue(obj)
        {
            queue[tail++] = obj;
        }

        function dequeue()
        {
            return queue[head++];
        }

        function is_empty()
        {
            return tail == head;
        }

        function visit(col, row)
        {
            board[col][row].isVisited = true;
            enqueue({
                col: col,
                row: row,
                predecessor: head - 1
            })
        }

        enqueue({
            col: start.col,
            row: start.row,
            predecessor: -1
        });

        var board = this.board;

        while (!is_empty())
        {
            var nowPos = dequeue();

            if (nowPos.col == dest.col && nowPos.row == dest.row)
                break;

            /* go up */
            if (nowPos.row - 1 >= 0 &&
                board[nowPos.col][nowPos.row - 1].sprite == null &&
                board[nowPos.col][nowPos.row - 1].isVisited == false)
            {
                visit(nowPos.col, nowPos.row - 1);
            }

            /* down */
            if (nowPos.row + 1 < this.MAX_ROW &&
                board[nowPos.col][nowPos.row + 1].sprite == null &&
                board[nowPos.col][nowPos.row + 1].isVisited == false)
            {
                visit(nowPos.col, nowPos.row + 1);
            }

            /* left */
            if (nowPos.col - 1 >= 0 &&
                board[nowPos.col - 1][nowPos.row].sprite == null &&
                board[nowPos.col - 1][nowPos.row].isVisited == false)
            {
                visit(nowPos.col - 1, nowPos.row);
            }

            /* right */
            if (nowPos.col + 1 < this.MAX_COL &&
                board[nowPos.col + 1][nowPos.row].sprite == null &&
                board[nowPos.col + 1][nowPos.row].isVisited == false)
            {
                visit(nowPos.col + 1, nowPos.row);
            }

        }


        if (nowPos.col == dest.col && nowPos.row == dest.row)
        {
            while (nowPos.predecessor != -1)
            {
                path.unshift(nowPos);
                nowPos = queue[nowPos.predecessor];
            }

            this.goToDest(path, start, dest);
        }

        this.resetIsVisited();
    },

    goToDest: function (path, start, dest) {

        var that = this;
        var board = this.board;

        function ballGo(step)
        {
            if (step == path.length)
            {
                if (that.smileBall)
                {
                    that.smileBall.setLocalZOrder(0);
                    that.smileBall.unSmile({batch: that.batch});
                }

                board[dest.col][dest.row].sprite = board[start.col][start.row].sprite;
                board[dest.col][dest.row].sprite.setCol(dest.col);
                board[dest.col][dest.row].sprite.setRow(dest.row);

                that.smileBall = null;
                board[start.col][start.row].sprite = null;

                that.checkAllDirections(dest.col, dest.row);
                that.removeBall(function () {

                    if (that.isGameOver())
                    {
                        /* game over */
                        that.handleGameOver();
                        return false;
                    }
                    else
                    {
                        that.addNewBall();

                        that.showNextBall();
                    }

                });

            }
            else
            {
                that.smileBall.runAction(
                    cc.Sequence.create(
                        cc.JumpTo.create(
                            0.15,
                            cc.p(that.boardPos.x + path[step].col * that.CELL_WIDTH,
                                    that.boardPos.y + path[step].row * that.CELL_HEIGHT),
                            40,
                            1
                        ),
                        cc.CallFunc.create(function () {
                            ballGo(step + 1);
                        })
                    )
                );
            }
        }

        ballGo(0);

    },

    setScore: function () {

        var oldLength = this.removeBallList.length;

        for (var i = 0; i < this.removeBallList.length; i++)
        {
            this.score += oldLength;
        }

        this.getChildByTag(this.SCORE_NUM).setString(this.score);

    },

    isGameOver: function () {

        var cellCount = 0;

        for (var i = 0; i < this.MAX_COL; i++)
        {
            for (var j = 0; j < this.MAX_ROW; j++)
            {
                if (this.board[i][j].sprite == null)
                    cellCount++;

                if (cellCount >= this.NEW_BALL_COUNT)
                    return false;
            }
        }

        return true;

    },

    handleGameOver: function () {

        if (this.score > GT.getRecord())
        {
            GT.setRecord(this.score);
        }

        var runningScene = cc.director.getRunningScene();

        var gameOverLayer = new GameOverLayer({
            showContinueBtn: false
        });

        runningScene.addChild(gameOverLayer, 0, GAME_OVER_LAYER);

    }

});

/**
 * 开发笔记
 * 1、js中如果一个构造函数有一个属性是obj那么继承字它的
 *    实例只是保存了一个指针而不是复制
 *    所以把一个数组直接写到传给extend的{}属性里是危险的
 *
 *    出了一个bug就是把smileBallLayer移除再创建isCanAdd函数报错
 *    if (this.removeBallList[i].sprite.getCol() == col &&
 *
 *    Uncaught TypeError: Cannot call method 'getCol' of null
 *
 *    经过我的分析得出结论是当游戏结束时this.removeBallList没有被清空
 *    ctor里也没有清空所以导致问题
 */