
window.game.player      = {
    status  : 0,
    level   : 1,
    name    : "",
    exp     : 1,
    img     : 0,

    location    : "place",
    room        : 0,

    hp      : {
        real    : 50,
        max     : 50
    },

    dmg     : {
        min     : 3,
        max     : 6
    },

    def     : 1,
    gold    : 5,

    stats   : {
        str     : 3,
        dex     : 3,
        luk     : 3,
        stm     : 3,
        free    : 3
    },

    chance  :{
        crit    : 1,
        dodge   : 1
    },

    items : {

        bug     : 4,

        slots : 3,

        equip   : {
            // доспех
            0 : false,
            // оружие
            1 : false,
            // вторая рука
            2 : false
        },

        inventory : [
            0
        ]

    },

    battle : {
        wins : 0,
        lose : 0
    }
};
