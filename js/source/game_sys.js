
window.game.sys         = {

    rand    : function(min, max){

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getDmg  : function(obj){

        var dmg = obj.dmg;

        return this.rand( dmg.min, dmg.max );
    },


    chance  : function(x){

        x = x * 100;

        return ( this.rand(1, 10000) <= x)

    },
    render  : {

        personage   : {
            info        : function(){},
            stats       : function(){},
            inventory   : function(){}
        },

        location    : {

        }

    }
};