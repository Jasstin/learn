/*
 * 消消乐
 *
 *   |- 0 0 0 0 -|
 *   |- 0 1 1 0 -|
 *   |- 0 2 2 0 -|
 *   |- 0 0 0 0 -|
 *  0-> 空位置 1-> 人物1 2->人物2
 *  根据数据生成游戏布局
 *  当页面发生点击时，
 *      第一次 点击：选中点击的人物,人物添加点中状态
 *      第二次 点击：同一位置    取消点中
 *                 不同位置 相同人物 两个人物同时消失 比赛加分
 *                         不同人物 两个人物同时取消选中 比赛不加分
 *  人物全部消失后，更新关卡
 *
 *  其他：
 *      游戏倒记时    人物全部消除后，游戏重新计时
 *                   游戏时间到，未消除全部人物，游戏结束
 * */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(root.jQuery);
    }
}(this, function ($) {
    var Game = function (container, options) {
        this.$container = $(container);
        this.options = options;
        this.checkpoint = 1;

        this.init();
    };
    Game.utils = {
        /*
         * 生成随机数
         * @param    max  最大值  生成随机数的范围，最小值为0
         * @param   length  生成随机数的数量
         * @return  arr 一组随机数
         * */
        getRandom: function (max, length) {
            var result = [],    //使用对象存储易于判断对象中是否存在当前随机数
                i,
                current;

            //数组随机排序
            function random(arr) {
                arr.sort(function (a, b) {
                    return Math.random() > Math.random();
                });
            }

            for (i = 0; i < max; i++) {
                result.push(i);
            }
            random(result);
            if (length - max > 0) {
                while (length - result.length > 0) {
                    result = result.concat(result.slice(0, Math.min(length - result.length, result.length)));
                }
                random(result);
            } else {
                result = result.slice(0, length);
            }

            return result;
        },
    };
    Game.prototype = {
        //初始化
        init: function () {
            //取出配置中personNum的关卡数并正序排序
            this.checkpointArr = [];
            var i;
            for (i in this.options.personNum) {
                this.checkpointArr.push(i);
            }
            this.checkpointArr.sort(function (a, b) {
                return +a - +b;
            });

            //计算布局
            this.containerWidth = 600;
            this.containerHeight = 600;
            this.column = 4;
            this.row = 4;
            this.spacing = 5;
            this.width = (this.containerWidth - (this.column - 1) * this.spacing) / this.column;
            this.height = (this.containerHeight - (this.row - 1) * this.spacing) / this.row;

            //绑定事件
            this.bind();
            //触发更新游戏事件
            this.$container.triggerHandler('updateGame');
        },
        //更新游戏状态
        update: function () {
            //判断剩余卡片数,如果为0，则重新发牌

            if (!$('.game-item', this.$container).size()) {
                this.checkpoint++;
                //触发更新游戏事件
                this.$container.triggerHandler('updateGame');
            }
        },
        /**
         * 点击人物事件
         * 第一次 点击：选中点击的人物,人物添加点中状态
         *      第二次 点击：同一位置    取消点中
         *                 不同位置 相同人物 两个人物同时消失
         *                         不同人物 取消选中已选中人物
         */
        bind: function () {
            var oldTarget,
                currentTarget,
                that = this;
            var itemIndex;
            var delayTime = 800;

            //添加选中状态
            function getFocus($obj) {
                itemIndex = that.personData[$obj.attr('data-place')];
                $obj.addClass('focus')
                    .promise()
                    .then(function () {
                        $obj.addClass('item' + that.options.itemClass[itemIndex]);
                    });
            }

            //恢复正常状态
            function toNormal($obj) {
                console.log($obj);
                itemIndex = that.personData[$obj.attr('data-place')];
                $obj.removeClass('focus')
                    .delay(500)
                    .promise()
                    .then(function () {
                        $(this).removeClass('item' + that.options.itemClass[itemIndex]);
                    });
            }

            //判断是否为同一人物
            function isSamePerson($newObj, $oldObj) {
                return that.personData[$newObj.attr('data-place')] == that.personData[$oldObj.attr('data-place')];
            }

            this.$container
                .on('click', '.game-item', function (ev) {
                    currentTarget = ev.currentTarget;   //获得监听器触发事件的节点
                    if (oldTarget == undefined) {
                        //选中点击的人物
                        getFocus($(currentTarget));
                        oldTarget = currentTarget;
                    }
                    else if (currentTarget == oldTarget) {
                        //点击同一位置，取消点中
                        toNormal($(currentTarget));
                        oldTarget = undefined;
                    }
                    else {
                        //点击不同位置，判断是否为同一人物，
                        // 如果是同一人物，两个人物同时移除，更新游戏状态
                        //如果是不同人物，取消选中已选中人物
                        //选中新元素
                        getFocus($(currentTarget));
                        setTimeout(function () {
                            if (isSamePerson($(currentTarget), $(oldTarget))) {
                                $(currentTarget).add(oldTarget)
                                    .fadeOut(500)
                                    .promise()
                                    .then(function () {
                                        $(this).remove();
                                        that.update();
                                    });
                            } else {
                                toNormal($(oldTarget));
                                toNormal($(currentTarget));
                            }
                            oldTarget = undefined;
                        }, delayTime);
                    }
                })
                .on('updateGame', function () {
                    //计算当局人物数
                    that.personNum = that.getPersonNum();//当局人物数
                    //获得当前局人物随机数据
                    that.personData = that.buildPerson();    //当前局人物数据
                    //布局
                    that.$container.html(that.buildDom());
                });
        },
        /**
         * 得到当前关卡的人物数
         * personNum: {'16': 6, '8': 4, '6': 2},    大于等于i的关键的人数为personNum[i]
         * checkpointArr:[6,8,16]
         * 思路:因为区间段是连续的：6-8，8-16，所以采用倒着比较的方式，如果大于最大值，则不再向下比较
         * @return num
         */
        getPersonNum: function () {
            var personNum = this.options.personNum,
                checkpointArr = this.checkpointArr,
                i;
            for (i = checkpointArr.length; i >= 0; i--) {
                if (this.checkpoint >= checkpointArr[i]) {
                    return personNum[checkpointArr[i]];
                }
            }
            return personNum[checkpointArr[0]];
        },
        /**
         * 得到一组数量与当前关卡人数相等的随机数数组
         * 数组值范围：0～系统配置人物数组的个数
         * */
        buildPerson: function () {
            var person = Game.utils.getRandom(this.options.itemClass.length, this.personNum / 2);
            person = person.concat(person);
            return person.sort(function () {
                return Math.random() > Math.random();
            });
        },
        /**
         *根据当前关卡的人物与位置信息，生成游戏卡片信息
         *  place   []  随机位置信息
         *  person  []  随机人物信息
         */
        buildItemDom: function () {
            var that = this;
            var column, row;    //记录卡片位置 行列
            return $.map(this.options.place[this.personNum], function (item, index) {
                column = item % that.column == 0 ? that.column : item % that.column;
                row = Math.ceil(item / that.column) - 1;
                return '<li class="game-item" style="width:' + that.width + 'px;'
                    + 'height:' + that.height
                    + 'px;position: absolute;'
                    + 'left:' + (that.width + that.spacing) * (column - 1)
                    + 'px;top:' + (that.height + that.spacing) * row + 'px;"' +
                    'data-place="' + index + '">'
                    + '<div class="game-item-front"></div>'
                    + '<div class="game-item-back"></div>'
                    + '</li>';
            }).join('');
        },
        /**
         *渲染页面布局结构
         * 布局的包裹层
         */
        buildDom: function () {
            return $('<ul>', {
                'class': 'game-container',
                'css': {
                    width: this.containerWidth + 'px',
                    height: this.containerHeight + 'px',
                    position: 'relative'
                },
                'html': this.buildItemDom()
            });
        }
        // 游戏倒计时
    };
    $.fn.eliminate = function () {
        var _eliminate;
        var options = $.extend({}, $.fn.eliminate.defaults, arguments[0]);
        _eliminate = $(this).data('$eliminate');
        if (!_eliminate) {
            _eliminate = new Game(this, options);
            $(this).data('$eliminate', _eliminate);
        }
        return _eliminate;
    };

    $.fn.eliminate.defaults = {
        layout: {
            containerWidth: 600,    //游戏16宫格宽度
            containerHeight: 600,   //游戏16宫格高度
            column: 4,  //行数
            row: 4, //列数
            spacing: 5, //格子之间的间距
        },
        itemClass: [1, 2, 3, 4, 5, 6],  //格子的样式名字
        personNum: {'3': 6, '2': 4, '1': 4, 4: 16}, //大于等于i关的人数为personNum个
        place: {    //不同人数的布局位置
            '2': [6, 7],
            '4': [6, 7, 10, 11],
            '6': [2, 3, 4, 5, 6, 7],
            '16': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        }
    };

    $.fn.eliminate.Constructor = Game;
}));