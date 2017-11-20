


var
    player  = {
        name    : 0,
        avatar  : '',

        lvl     : 0,
        exp     : 0,

        gold    : 0,

        stats   : {
            str     : 0,
            dex     : 0,
            luk     : 0,
            stm     : 0,

            def     : 0,

            dmg     : {
                min     : 0,
                max     : 0
            },

            chance  : {
                dodge   : 0,
                crit    : 0
            }
        },

        items       : {
            limit       : 7,
            equip       : {
                main        : 0,
                chest       : 0,
                second      : 0
            },
            inventory   : []
        },

        combats : {
            win     : 0,
            los     : 0
        }
    },

    enemy   = {
        name    : 0,
        avatar  : '',

        stats   : {
            def     : 0,

            dmg     : {
                min     : 0,
                max     : 0
            },

            chance  : {
                dodge   : 0,
                crit    : 0
            }
        },
        rewards       : []
    },

    game    = {
        target  : {},
        unit    : {},
        player  : {},
        enemy   : {},
        items   : {},
        stats   : {},
        ui      : {},

        init    : function(){

        }
    };





game.unit = {

    init        : function(type)
    {
        return {
            combat      :
            {
                owner       : type,

                heal        : function()
                {
                    game.unit.heal(this.owner);
                },

                strike      : function()
                {
                    game.unit.strike(this.owner);
                }
            }
        }
    },

    heal        : function(type)
    {

    },

    strike      : function(type)
    {

    }
};





game.player = game.unit.init('player');
game.player.combat.death        = function(){};
game.player.combat.win          = function(){};
game.player.move                = function(position){};





game.player.upgrade             = {

    construct  : function(item,path){
        return {
            item        : eval('player'+path+item),
            render      : eval('game.ui.render.profile.stats'+item),
            add         : function(num){
                for (var i=0; i < num; i--){
                    this.item++;
                }
                this.callback();
                this.render();
            },
            remove      : function(num){
                for (var i=0; i < num; i--){
                    this.item--;
                }
                this.callback();
                this.render();
            },
            set         : function(num){
                this.item = num;
                this.callback();
                this.render();
            },
            must        : function(x){
                return (  this.item >= x );
            },
            callback    : function(){}
        }
    },

    stats     : {
        str         : {},
        dex         : {},
        luk         : {},
        stm         : {}
    },

    lvl         : {},
    exp         : {},
    gold        : {}
};
game.player.upgrade.stats.str   = game.player.upgrade.construct('str','.stats.');
game.player.upgrade.stats.dex   = game.player.upgrade.construct('dex','.stats.');
game.player.upgrade.stats.luk   = game.player.upgrade.construct('luk','.stats.');
game.player.upgrade.stats.stm   = game.player.upgrade.construct('stm','.stats.');
game.player.upgrade.lvl         = game.player.upgrade.construct('lvl','.');
game.player.upgrade.exp         = game.player.upgrade.construct('exp','.');
game.player.upgrade.gold        = game.player.upgrade.construct('gold','.');





game.enemy                      = game.unit.init('enemy');
game.enemy.select               = function(){};
game.enemy.death                = function(){};
game.enemy.drop                 = function(){};





game.items                      = {
    base        : [],
    template    : {
        name        : '',
        about       : '',
        type        : 0,
        def         : 0,
        lvl         : 0,
        dmg         : {
            min         : 0,
            max         : 0
        },
        stats       : {
            str         : 0,
            dex         : 0,
            luk         : 0,
            stm         : 0
        },
        chance      : {
            dodge       : 0,
            crit        : 0
        },
        price       : {
            bye         : false,
            sell        : false
        }
    },
    construct   : function(data) {

        var item = this.template;

        if (data.name != undefined )    item.name = data.name;
        if (data.about != undefined )   item.about = data.about;
        if (data.type != undefined )    item.type = data.type;
        if (data.def != undefined )     item.def = data.def;
        if (data.lvl != undefined )     item.lvl = data.lvl;

        if (data.dmg != undefined )
        {
            if ( data.dmg.min != undefined )    item.dmg.min    = data.dmg.min;
            if ( data.dmg.max != undefined )    item.dmg.max    = data.dmg.max;
        }

        if (data.stats != undefined )
        {
            if ( data.stats.str != undefined )  item.stats.str  = data.stats.str;
            if ( data.stats.dex != undefined )  item.stats.dex  = data.stats.dex;
            if ( data.stats.luk != undefined )  item.stats.luk  = data.stats.luk;
            if ( data.stats.stm != undefined )  item.stats.stm  = data.stats.stm;
        }

        if (data.chance != undefined )
        {
            if ( data.chance.dodge != undefined )   item.chance.dodge   = data.chance.dodge;
            if ( data.chance.crit != undefined )    item.chance.crit    = data.chance.crit;
        }

        if (data.price != undefined )
        {
            if ( data.price.bye != undefined )      item.price.bye      = data.price.bye;
            if ( data.price.sell != undefined )     item.price.sell     = data.price.sell;
        }

        return this.base.push(item);
    },

    add         : function(){},

    remove      : function(){},

    bye         : function(){},

    sell        : function(){},

    equip       : function(){},

    drop        : function(){},

    craft       : function(){},

    upgrade     : function(){}


};





game.ui                         = {

    num         : function(int, str) {

        return Math.ceil(int) + (str != undefined ) ? str : '';
    },

    render      : {

        location    : {

            init        : function(){},

            arena       : {
                init        : function(){}
            },
            smith       : {
                init        : function(){}
            },
            shop        : {
                init        : function(){}
            }
        },

        portrait    : {

            init        : function(){},

            name        : function(){},
            level       : function(){},
            avatar      : function(){},
            hp          : function(){}
        },

        profile     : {

            init        : function(){},

            show        : function(){},
            hide        : function(){},

            name        : function(){},
            level       : function(){},

            info        : {
                avatar      : function(){},
                items       : function(){}
            },
            stats       : {
                all         : function(){},

                str         : function(){},
                dex         : function(){},
                luk         : function(){},
                stm         : function(){},
                free        : function(){},

                upgrade     : function(){},

                dmg         : function(){},
                def         : function(){},

                dodge       : function(){},
                crit        : function(){},

                win         : function(){},
                los         : function(){},

                lvl         : function(){},
                exp         : function(){}

            },
            inventory   : {
                gold        : function(){},
                bug         : function(){},
                items       : function(){}
            }
        }
    }
};




