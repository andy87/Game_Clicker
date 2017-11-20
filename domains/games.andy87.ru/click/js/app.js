
window.game = {

    load        : {

        init        : function()
        {
            var action = ['form','game'];

            $('#'+action[0]).hide();
            $('#'+action[1]).hide();

            if ( localStorage.getItem('player') != undefined ) {

                window.game.player = JSON.parse(localStorage.getItem('player'));
            }

            action = action[ window.game.player.status ];

            $( '#' + action ).show();

            this[ action ].init();
        },



        // Запуск игры
        game    : {

            init        : function()
            {

                window.game.actions.profile.init();

                window.game.actions.portrait.init();

                window.game.actions.personage.init();

                window.game.actions.location.init();

                $('A.close-wrapper').click(function(){

                    $(this).parent().hide();
                });

            }
        },



        // Регистрация
        form    : {

            init        : function(){

                $('[name="avatar"]').change(function(){

                    var src = 'img/player/v' + $(this).attr('value') +'.jpg';

                    $('#reg_avatar').attr('src', src);

                });

                $('.form.registry').submit(function(e){

                    e.preventDefault();

                    var player      = window.game.player,
                        avatar      = $('[name="avatar"]:checked').attr('value');

                    player.name = $('#reg-nickname').val();

                    player.img = avatar;

                    player.status = 1;

                    window.game.save(function(){

                        window.location.reload();

                    });

                    return false;

                });

            }
        }
    },


    save        : function(callback){

        localStorage.setItem('player', JSON.stringify(window.game.player) );

        if ( callback != undefined ) callback();

    },

    reset       : function(){

        localStorage.clear('player');

        setTimeout(function(){
            window.location.reload();
        }, 250)

    },


    props       : {},

    sys         : {},

    player      : {},

    enemy       : {},

    actions     : {},

    items       : [],

    mobs        : [],

    xxx         : []

};



$(document).ready(function(){

    window.game.load.init();

});








window.game.actions = {



    // Портрет
    portrait    : {

        wrapper     : '#user-info',

        pic         : '#img_portrait',

        portrait    : '.user-portrait',

        name        : '.user-name',

        level       : '.user-level',

        progress    : {
            text        : '.progress-text',
            line        : '.progress-line'
        },

        init        : function() {

            this.renderHp();

            this.setupImg();

            this.setupName();

            this.renderLevel();

            $(this.wrapper + ' ' + this.portrait ).click(function(){

                $(window.game.actions.profile.wrapper).show();

            });

            $(this.wrapper + ' .reset' ).click(function(){

                window.game.reset();

            });
        },

        setupName   : function() {

            $(this.wrapper + ' ' + this.name ).text(window.game.player.name);
        },

        setupImg    : function() {

            var path = '/img/player/avatar/v' + window.game.player.img +'.jpg';

            $(this.pic).attr('src',path);
        },

        renderLevel : function() {

            $(this.wrapper + ' ' + this.level ).text(window.game.player.level);
        },

        renderHp    : function() {

            var real    = window.game.player.hp.real,
                max     = window.game.player.hp.max,
                wrap    = $(this.wrapper),

                hp      =  ( 100 * ( real / max ) );

            wrap.find( this.progress.text ).text( Math.ceil(real) + ' / '+ max );
            wrap.find( this.progress.line ).css({
                width : hp + '%'
            });
        }

    },



    personage   : {

        init        : function() {

            this.hp.regen();
        },

        hp          : {

            regen       : function() {

                // full HP * за минут
                var hp          = window.game.player.hp,
                    fullRegen   = window.game.props.x.regen,
                    time        = (1000 * ( fullRegen * 60 ))/100;

                time = time / window.game.props.x.speed;

                setInterval(function(){

                    hp.real += (hp.max/100);

                    if ( hp.real > hp.max ) hp.real = hp.max;

                    window.game.actions.portrait.renderHp();

                    window.game.save();

                }, time);
            },

            damage  : function(dmg) {

                var hp = window.game.player.hp;

                hp.real -= dmg;

                if ( hp.real < 0 ) hp.real = 0;
                window.game.actions.portrait.renderHp();

                window.game.save();
            },

            heal  : function(heal) {

                var hp = window.game.player.hp;

                hp.real += heal;

                if ( hp.real > hp.max ) hp.real = hp.max;
                window.game.actions.portrait.renderHp();

                window.game.save();
            }
        },

        exp         : {

            add         : function(val) {

                window.game.player.exp += val;

                var player  = window.game.player,
                    stats   = window.game.actions.profile.stats,
                    props   = window.game.props,
                    need    = props.levels[ player.level ];

                if ( player.exp > need )
                {
                    player.exp -= need;

                    player.level++;

                    player.stats.free = 5 + player.level;

                    stats.render.lvl();
                    stats.render.free();
                    stats.render.checkUpgrade();
                    window.game.actions.portrait.renderLevel();

                }

                window.game.save(function()
                {
                    window.game.actions.profile.stats.render.exp();

                });
            }
        },

        gold        : {

            need        : function(gold) {

                return ( window.game.player.gold >= gold )
            },

            add         : function(gold) {

                window.game.player.gold += gold;
                window.game.actions.profile.inventory.renderGold();
            },

            remove      : function(gold) {

                window.game.player.gold -= gold;
                window.game.actions.profile.inventory.renderGold();

            }
        },

        item        : {

            self        : function() {

                return window.game.player.items;
            },

            add         : function(id) {

                if ( window.game.player.items.inventory.length >= window.game.player.items.slots  ) return;

                window.game.player.items.inventory.push(id);

                window.game.actions.profile.inventory.renderItems();

                window.game.save();
            },

            remove      : function(index) {

                if ( window.game.player.items.inventory[index] == undefined ) return;

                window.game.player.items.inventory.splice(index,1);

                window.game.actions.profile.inventory.renderItems();

                window.game.save();

            },

            equip       : function(index) {

                var items   = window.game.player.items,
                    id      = items.inventory[index],
                    type    = window.game.items[id]['type'];


                switch (type) {
                    case 0:
                    case 1:
                    case 2:
                        // 0 chest
                        // 1 main hand
                        // 2 second hand

                        if ( items.equip[type] === false ) {

                            this.remove(index);

                        } else {

                            window.game.actions.profile.stats.upgrade.effect.drop(id);

                            items.inventory[index] = items.equip[type];
                        }

                        items.equip[type] = id;

                        window.game.actions.profile.stats.upgrade.effect.equip(id);

                        break;

                    case 3:

                        var item = window.game.items[ id ];

                        if ( item['slots'] < items.inventory.length ) {

                            return;
                        }

                        items.inventory[index] = items.bug;
                        items.bug = id;

                        break;
                    default:
                        return;
                }

                window.game.actions.profile.info.renderEquip();
                window.game.actions.profile.inventory.renderItems();
                window.game.actions.location.render.shop();

                window.game.save();
            },

            drop        : function(index) {

                var items = window.game.player.items;

                if ( items.slots <= items.inventory.length ) return;

                var id      = items.equip[index];

                this.add(id);

                window.game.actions.profile.stats.upgrade.effect.drop(id);

                items.equip[index] = false;

                window.game.actions.profile.info.renderEquip();
                window.game.actions.profile.inventory.renderItems();
                window.game.actions.location.render.shop();

                window.game.save();
            },

            sell        : function(id) {

                var item = window.game.items[id];

                this.remove(id);

                window.game.actions.gold.add(item.sell);

                window.game.actions.profile.inventory.renderItems();

                window.game.save();
            },

            bye         : function(id) {

                var item = window.game.items[id];

                if ( !window.game.gold.need(item.bye) ) return;

                this.add(item);

                window.game.actions.gold.remove(item.bye);

                window.game.actions.profile.inventory.renderItems();

                window.game.save();
            }
        }
    },



    profile     : {

        wrapper     : '#profile',

        title       : '.profile-tilte',

        items       : {
            info        : '.profile-info',
            stats       : '.profile-stats',
            tools       : '.tools-bar',
            inventory   : '.inventory-wrapper',
            bug         : '.inventory-bug',
            box         : 'inventory-box'
        },

        tabs        : {
            item        : '.tabs-item',
            body        : '.tabs-body'
        },

        init        : function() {

            this.info.setImg();
            this.setTitle( window.game.player.name );

            this.stats.render.all();

            $( this.wrapper ).draggable({ handle: this.title });

            var $self = this;

            $(this.tabs.item).click(function() {

                var $item = $(this);

                $($self.wrapper + ' ' + $self.tabs.body).hide();

                $($self.wrapper + ' ' + $self.tabs.body).filter($item.attr('href')).show();
            });


            $(this.stats.wrapper + ' ' + this.stats.button).click(function(e) {

                e.preventDefault();

                var type = $(this).attr('href');

                $self.stats.upgrade[type]();

                return false;
            });


            $( document ).on( "click", this.items.tools + ' .player-tool .item', function(e) {

                e.preventDefault();

                var index = parseInt($(this).data('index'));

                window.game.actions.personage.item.drop(index);

                return false;
            });

            $( document ).on( "click", this.items.inventory + ' ' + '.' + this.items.box + ' .item', function(e) {

                e.preventDefault();

                var index = parseInt($(this).data('index'));

                window.game.actions.personage.item.equip(index);

                return false;
            });

            window.game.actions.profile.info.renderEquip();

            window.game.actions.profile.inventory.renderItems();

            $.each(window.game.player.items.equip, function(index, item) {

                if ( item !== false ) window.game.actions.profile.stats.upgrade.effect.drop(item);
                if ( item !== false ) window.game.actions.profile.stats.upgrade.effect.equip(item);

            });
        },

        setTitle    : function(str) {

            $(this.wrapper + ' ' + this.title ).text(str);
        },

        info        : {

            img         : '#img_personage',

            setName     : function(){

            },

            setImg      : function() {

                var src = 'img/player/v' + window.game.player.img +'.jpg';

                $( this.img ).attr('src', src);
                $( '#battle_hero' ).attr('src', src);
            },

            renderEquip : function(){

                var game    = window.game,
                    toolBar = $(game.actions.profile.wrapper + ' ' + game.actions.profile.items.tools),
                    type    = ['.chest','.main','.second'];

                $.each(game.player.items.equip, function( index, id ) {

                    var box = toolBar.find(type[index]).text('');

                    if (id === false) return;

                    var item = $('<img>',{
                        src     : game.items[id]['img'],
                        id      : 'equip_item_id_' + id + '_index_' + index,
                        'class' : 'item',
                        title   : game.items[id]['name'],
                        'data-index' : index
                    });

                    box.append(item);
                });
            }
        },

        stats       : {

            wrapper     : '#profile-stats',

            button      : '.stats-upgrade',

            str         : 'str',
            dex         : 'dex',
            luk         : 'luk',
            stm         : 'stm',
            free        : 'free',

            render      : {

                all : function() {

                    this.str();
                    this.dex();
                    this.luk();
                    this.stm();
                    this.exp();
                    this.dodge();
                    this.crit();
                    this.wins();
                    this.los();
                    this.lvl();
                    this.checkUpgrade();
                },

                checkUpgrade : function() {

                    var button = window.game.actions.profile.stats.button,
                        player = window.game.player;

                    if ( player.stats.free > 0 && $( button + ':first').is(':hidden') )
                    {
                        $( button ).show();
                    }
                },

                common  : function(type) {

                    var names   = window.game.actions.profile.stats,
                        stats   = window.game.player.stats;

                    $(names.wrapper + ' .points.' + names[type]).text( stats[type] );

                    $(names.wrapper + ' .points.' + names.free).text( stats.free );

                    if ( stats.free <= 0 ) {
                        $(names.wrapper + ' ' + names.button).hide();
                    }

                },

                str     : function() {

                    this.common('str');
                    this.dmg();
                },

                dex     : function() {

                    this.common('dex');
                    this.dodge();
                },

                luk     : function() {

                    this.common('luk');
                    this.crit();
                },

                stm     : function() {

                    this.common('stm');
                    this.def();
                    window.game.actions.portrait.renderHp();
                },

                free    : function() {

                    this.common('free');
                },

                other   : function(cls, val) {

                    $(window.game.actions.profile.stats.wrapper + ' .points.' + cls ).text( val );
                },

                def     : function() {

                    this.other('def', window.game.player.def );
                },

                dodge   : function() {

                    this.other('dodge', window.game.player.chance.dodge + '%' );
                },

                crit    : function() {


                    this.other('crit', window.game.player.chance.crit + '%' );
                },

                dmg     : function() {

                    this.other('dmg.min', Math.ceil(window.game.player.dmg.min) );
                    this.other('dmg.max', Math.ceil(window.game.player.dmg.max) );
                },

                wins    : function() {

                    this.other('wins', window.game.player.battle.wins );
                },

                los     : function() {

                    this.other('loses', window.game.player.battle.lose );
                },

                lvl     : function() {

                    this.other('level', window.game.player.level );

                },

                exp     : function() {

                    this.other('exp.real', window.game.player.exp );
                    this.other('exp.next', window.game.props.levels[ window.game.player.level ] );
                }
            },

            upgrade     : {

                effect  : {

                    str     : function() {

                        var dmg = window.game.player.dmg;

                        dmg.min++;
                        dmg.max = (dmg.min*2);
                    },

                    dex     : function() {

                        var player = window.game.player;

                        player.chance.dodge = (player.stats.dex / 2 + player.level / 2);

                    },

                    luk     : function() {

                        var player = window.game.player;

                        player.chance.crit = (player.stats.luk / 2 + player.level / 2);
                    },

                    stm     : function() {

                        var player = window.game.player;

                        player.hp.max += 5;
                        player.def++;
                    },

                    equip   : function(id) {

                        var item = window.game.items[ id ];

                        var player = window.game.player;

                        if ( item.def > 0 ) player.def += item.def;

                        if ( item.dmg.min > 0 ) player.dmg.min += item.dmg.min;
                        if ( item.dmg.max > 0 ) player.dmg.max += item.dmg.max;

                        window.game.actions.profile.stats.render.dmg();
                        window.game.actions.profile.stats.render.def();
                    },

                    drop    : function(id) {

                        var item = window.game.items[ id ];

                        var player = window.game.player;

                        if ( item.def > 0 ) player.def -= item.def;

                        if ( item.dmg.min > 0 ) player.dmg.min -= item.dmg.min;
                        if ( item.dmg.max > 0 ) player.dmg.max -= item.dmg.max;

                        window.game.actions.profile.stats.render.dmg();
                        window.game.actions.profile.stats.render.def();
                    }
                },

                common  : function(type) {


                    var stats   = window.game.player.stats;

                    if ( stats.free <= 0 ) return false;

                    stats[type] += 1;

                    this.effect[type]();

                    stats.free--;

                    window.game.save(function(){

                        window.game.actions.profile.stats.render[type]();
                    });
                },

                str     : function() {

                    this.common('str');
                },

                dex     : function() {

                    this.common('dex');
                },

                luk     : function() {

                    this.common('luk');
                },

                stm     : function() {

                    this.common('stm');
                }
            }
        },

        inventory   : {

            renderGold  : function(){

                $('#profile-inventory .points.gold').text(window.game.player.gold);

            },

            renderItems : function() {

                var game        = window.game,
                    inventory   = $(game.actions.profile.wrapper + ' ' + game.actions.profile.items.inventory),
                    bug_id      = window.game.player.items.bug,

                    bug         = window.game.items[ bug_id ];

                window.game.player.items.slots = bug['slots'];

                inventory.find(game.actions.profile.items.bug).text('').append($('<img>',{
                    src     : bug['img'],
                    id      : 'bug_id_' + bug_id,
                    'class' : 'item',
                    title   : bug['name']
                }));

                inventory.find('.'+game.actions.profile.items.box).remove();

                for(var i=0; i < window.game.player.items.slots; i++ ){

                    inventory.append($('<div>',{
                        'class' : game.actions.profile.items.box
                    }));
                }

                $.each(game.player.items.inventory, function( index, id ) {

                    if (id === false) return;

                    var box = inventory.find('div').eq(index+1);

                    var item = $('<img>',{
                        src     : game.items[id]['img'],
                        id      : 'inventory_item_id_' + id + '_index_' + index,
                        'class' : 'item',
                        title   : game.items[id]['name'],
                        'data-index' : index
                    });

                    box.append(item);
                });

                $('#profile .points.gold').text(window.game.player.gold)

            }
        }
    },



    location    : {

        wrapper     : '#location',

        init        : function() {

            var self    = this,
                $arena  = $('#arena'),
                $shop   = $('#shop');

            $(self.wrapper + ' .goTo').click(function (e) {

                self.goTo($(this).data('location'));

            });

            //ARENA
            this.renderArena();

            $arena.on('click', '.selector BUTTON', function () {

                var x = $(this).data('x');

                window.game.actions.enemy.add(x);
            });


            // SHOP
            $shop.on('click', '.b-shop__button', function(){

                var $this   = $(this),
                    id      = $this.data('id'),
                    game    = window.game,
                    act     = window.game.actions,
                    pers    = window.game.actions.personage,
                    item    = game.items[ id];

                if ( $this.hasClass('bye') ) {

                    if ( pers.gold.need(item.bye) ){

                        pers.gold.remove(item.bye);
                        pers.item.add(id);
                    }

                } else {

                    var itemId = game.player.items.inventory.indexOf(id);

                    if ( itemId === -1 ) return;

                    pers.item.remove(itemId);

                    pers.gold.add(item.sell);
                }

                act.profile.inventory.renderItems();
                act.location.render.shop();
                game.save();

            });

            $shop.on('click', '.toggle_shop', function(){

                var type = $(this).data('type');

                $('#shop .block__shop').hide();

                $('#shop .block__shop.' + type).show();
            });

            this.goTo(window.game.player.location);

        },

        renderArena : function(){

            var $arena = $('#arena');

            $arena.children().hide();
            $arena.children().first().show();
        },

        goTo        : function(place){

            //TODO : При двойном нажатии на F5 place == undefined o__O
            if ( place == undefined ) place = 'place';

            var wrap = this.wrapper + ' .location';

            $(wrap).addClass('none').hide();

            $(wrap + '.' + place).removeClass('none').show();

            window.game.player.location = place;
            window.game.save();

            if ( this.callback[place] != undefined ) this.callback[place](window.game);

        },

        callback    : {

            arena       : function(){

                window.game.actions.location.renderArena();

                window.game.actions.location.render.arena();
            },

            shop        : function(){

                $('#shop .block__shop').hide();
                $('#shop .block__shop.bye').show();

                window.game.actions.location.render.shop();

            },

            smith       : function(){

                window.game.actions.location.render.smith();

            }

        },

        render      : {

            arena       : function(){

                window.game.actions.enemy.clear();
            },

            shop        : function(){

                var template    = function(id, text, type){

                    var item    = window.game.items[ id ];

                    var li = $('<li>',{
                            'class' : "b-shop__item"
                        })

                    .append($('<img>',{
                        src    : item.img,
                        'class' : "b-shop__img"
                    }))
                    .append($('<h6/>',{
                        text    : item.name,
                        'class' : "b-shop__name"
                    }))
                    .append($('<span/>',{
                        text    : item[type],
                        'class' : "b-shop__price"
                    }))
                    .append($('<button/>',{
                        text    : text,
                        'class' : "b-shop__button "+type,
                        'data-id' : id
                    }));

                    return li;
                };

                var generator   = function(type, bd, text){

                    var wrap = $('#shop .block__shop.' + type);

                    $.each(bd, function(index, id){

                        if ( type === 'bye' ) id = index;

                        wrap.append( template(id, text, type) );
                    });
                };

                $('#shop').find('.block__shop').empty();

                generator('sell', window.game.player.items.inventory, 'продать');

                generator('bye', window.game.items, 'купить');
            },

            smith       : function(){

            }
        }
    },



    //battle
    enemy       : {

        tap         : {
            attack      : false,
            defence     : false
        },

        speed       : {
            init        : {
                min      : 3000,
                max     : 7000
            },
            tap         : {
                attack      : 1500,
                defence     : 1500
            },
            floatText   : 3000,
            effect  : {
                attack      : 500,
                defence     : 500
            }
        },

        add         : function(x) {

            var player  = window.game.player,
                level   = Math.ceil(player.level * x),
                rand    = window.game.sys.rand(0, window.game.mobs.length - 1 );

            window.game.enemy = window.game.mobs[ rand ];

            var enemy = window.game.enemy;

            enemy.exp       *= x;
            enemy.hp        = (enemy.hp * window.game.props.x.hp);
            enemy.hp        = {
                real            : enemy.hp * x,
                max             : enemy.hp * x
            };
            enemy.dmg.min   *= x;
            enemy.dmg.max   *= x;

            enemy.level     = level;

            var $arena = $('#arena');
            $arena.find('.selector').hide();
            $arena.find('.battle').show();

            var $enemy  = $arena.find('.battle .block__enemy');

            $enemy.find('.b-enemy__name').text(enemy.name);
            $enemy.find('.b-enemy__img').attr('src', "img/mobs/" + enemy.img + ".png");

            this.renderHp();

            setTimeout(function () {
                window.game.actions.enemy.fight();
            },window.game.sys.rand(window.game.actions.enemy.speed.init.min, window.game.actions.enemy.speed.init.max));

            setTimeout(function () {
                window.game.actions.enemy.defence();
            },window.game.sys.rand(window.game.actions.enemy.speed.init.min, window.game.actions.enemy.speed.init.max));
        },

        renderHp    : function () {

            var $hp = $('#arena .battle .block__enemy .b-enemy__hp'),
                i   = (window.game.enemy.hp.real / window.game.enemy.hp.max) * 100;

            $hp.find('.hp__int').text(window.game.enemy.hp.real);
            $hp.find('.hp__bar').width(i +"%");
        },

        floatText   : function( type, int, obj, cls ) {

            var top     = obj.offset().top - obj.parent().offset().top,
                left    = obj.offset().left - obj.parent().offset().left,
                text    = $('<span/>',{
                text        : int,
                'class'     : 'floatText' + cls
            }).css({
                color   : (type == 'attack') ? 'red' : 'green',
                opacity : 1,
                top     : top,
                left    : left
            });

            if ( type == 'attack' ) {

                $('#arena .b-enemy__border').append(text);

            } else {

                $('#arena .block__hero').append(text);
            }

            text.animate({
                opacity : 0,
                top     : top - (top/5)
            }, window.game.actions.enemy.speed.floatText, function(){

                text.remove();
            });

            this.tap[type].stop().remove();
        },

        effects     : {

            attack      : function () {

                var
                    obj = $('.b-enemy__effect');

                    obj.show();

                setTimeout(function(){
                    obj.hide();
                }, window.game.actions.enemy.speed.effect.attack);
            }
        },

        fight       : function(){

            var game    = window.game,
                $self   = this,
                $wrap   = $('#arena .b-enemy__border'),

                reset   = function(){
                    setTimeout(function(){

                        window.game.actions.enemy.fight();

                    }, window.game.sys.rand( 1000 * window.game.props.x.speed, 6000 * window.game.props.x.speed ));
                },

                pos     = {
                    top     : window.game.sys.rand(10, 90),
                    left    : window.game.sys.rand(10, 90)
                },

                dmg     = window.game.sys.getDmg(window.game.player),

                x       = 15;

            var crit = window.game.sys.chance( window.game.player.chance.crit );
            if ( crit ) dmg = dmg * 2;


            $self.tap.attack = $('<span/>',{
                'class' : "b-enemy__tap"
            }).css({
                padding : x+'%',
                top     : pos.top+'%',
                left    : pos.left+'%'
            });

            $self.tap.attack.click(function(){

                game.actions.enemy.effects.attack();

                game.enemy.hp.real = game.enemy.hp.real - dmg;
                game.actions.enemy.floatText('attack', ((crit) ? 'Крит -': '-') + dmg, $self.tap.attack, (crit) ? ' crit': '' );

                game.actions.enemy.renderHp();

                game.actions.enemy.isWin();

                if ( window.game.enemy.hp.real > 0 && window.game.player.hp.real > 0 ) reset();

            });

            $self.tap.attack.animate({
                padding     : '0%',
                top         : (pos.top+x)+'%',
                left        : (pos.left+x)+'%'
            }, window.game.actions.enemy.speed.tap.attack * window.game.props.x.speed, function(){

                $self.tap.attack.stop().remove();

                reset();

            });

            $wrap.append($self.tap.attack);
        },

        defence     : function(){

            var game    = window.game,
                $self   = this,
                $wrap   = $('#arena .block__hero'),

                reset   = function(){

                    setTimeout(function(){

                        window.game.actions.enemy.defence();

                    }, window.game.sys.rand( 5000 * window.game.props.x.speed, 10000 * window.game.props.x.speed ));
                },

                pos     = {
                    top     : window.game.sys.rand( 10, 90 ),
                    left    : window.game.sys.rand( 10, 90 )
                },

                x       = 12;

            $self.tap.defence = $('<span/>',{
                'class' : "b-enemy__tap defence"
            }).css({
                padding : x+'%',
                top     : pos.top+'%',
                left    : pos.left+'%'
            });


            var dmg     = window.game.sys.getDmg(window.game.enemy),

                setDmg  = function(dmg){
                    window.game.player.hp.real -= dmg;
                    window.game.actions.portrait.renderHp();
                };

            dmg     = dmg - (window.game.player.def/2);

            if ( dmg < 1 ) dmg = 2;

            $self.tap.defence.click(function(){

                dmg =  dmg / 2;

                setDmg(dmg);
                game.actions.enemy.floatText('defence', dmg, $self.tap.defence, '');

                game.actions.portrait.renderHp();

                game.actions.enemy.isLose();

                reset();

            });


            $self.tap.defence.animate({
                padding     : '0%',
                top         : (pos.top+x)+'%',
                left        : (pos.left+x)+'%'
            }, window.game.actions.enemy.speed.tap.defence * window.game.props.x.speed, function(){

                setDmg(dmg);

                game.actions.enemy.floatText('defence', dmg, $self.tap.defence, '');

                game.actions.enemy.isLose();

                if ( window.game.enemy.hp.real > 0 && window.game.player.hp.real > 0 ) reset();

            });

            $wrap.append($self.tap.defence);


            if ( window.game.sys.chance( window.game.player.chance.dodge ) ) {

                game.actions.enemy.floatText('defence', 'Уворот!', $self.tap.defence, ' dodge');

                reset();
            }
        },


        isWin       : function(){

            if ( window.game.enemy.hp.real < 1 ){

                window.game.enemy.hp.real = 0;
                window.game.actions.enemy.renderHp();

                var hp      = window.game.enemy.hp.max,
                    gold    = window.game.sys.rand( hp/10, hp );

                window.game.actions.personage.gold.add(gold);

                var chest = 'img/items/chest.png';

                $('#arena .b-enemy__img').attr({
                    src     : chest,
                    title   : "Заберите награду"
                }).on('click',function(){

                    $('#reward').show();
                });

                this.getLoot();
            }
        },

        isLose      : function(){

            if ( window.game.player.hp.real < 1 ) {

                window.game.player.hp.real = 1;
                window.location = '/';
                window.location.reload();
            }
        },

        getLoot     : function(){

            var item = window.game.items[ window.game.sys.rand( 0, window.game.items.length-1 )];

            console.log(item);
        },


        clear       : function() {

            window.game.enemy = {
                id      : 0,
                lvl     : 0,
                dmg     : {
                    min     : 0,
                    max     : 0
                },
                hp      : {
                    real    : 0,
                    max     : 0
                }
            };
        }
    }
};





window.game.enemy       = {
    id      : 0,
    lvl     : 0,

    dmg     : {
        min     : 0,
        max     : 0
    },
    hp      : {
        real    : 0,
        max     : 0
    }
};


// type
// 0 chest
// 1 main hand
// 2 second hand
// 3 bugs
// 4 quest
var createItem = function(/*name, type, img, dmg, def, slots, bye*/ )
{
    var path = [
        'img/items/chest/',
        'img/items/main_hand/',
        'img/items/second_hand/',
        'img/items/bugs/',
        'img/items/quest/'
    ];

    var prop = function( obj, type, id, def ) {

        return  ( obj[1] == undefined && obj[0][type] ) ? obj[0][type] : ( obj[id] == undefined ) ? def : obj[id];
    };

    var x = arguments;

    var type    = prop(x, 'type', 1, 0),
        dmg     = prop(x, 'dmg', 3, 0),
        bye     = prop(x, 'bye', 6, 0);

    return {
        name    : prop(x, 'name', 0, 'default'),
        type    : type,
        img     : path[type] + prop(x, 'img', 2, 1) + '.jpg',
        dmg     : {
            min     : dmg/2,
            max     : dmg*1.5
        },
        def     : prop(x, 'def', 4, 0),
        slots   : prop(x, 'slots', 5, 0),
        bye     : bye,
        sell    : ( bye / 2 )
    }
};



window.game.items = [];

//Оружие
window.game.items.push(createItem('Кинжал', 1, 1, 6, 0, 0, 10)); //0
window.game.items.push(createItem('Нож', 1, 2, 9, 0, 0, 50)); //1

//Честы
window.game.items.push(createItem('Кожаная броня', 0, 1, 0, 5, 0, 15)); // 2
window.game.items.push(createItem('Латы новичка', 0, 2, 0, 10, 0, 30)); // 3

//Рюкраки
window.game.items.push(createItem({ // 4
    name    : 'малый мешок',
    img     : 1,
    type    : 3,
    slots   : 3,
    bye     : 10
}));
window.game.items.push(createItem({ // 5
    name    : 'средний рюкзак',
    img     : 2,
    type    : 3,
    slots   : 7,
    bye     : 30
}));
window.game.items.push(createItem({ // 6
    name    : 'большой рюкзак',
    img     : 2,
    type    : 3,
    slots   : 11,
    bye     : 50
}));
window.game.items.push(createItem({ // 7
    name    : 'Щит новичка',
    img     : '1',
    type    : 2,
    def     : 10,
    bye     : 20
}));
window.game.items.push(createItem({ // 8
    name    : 'Щит война',
    img     : '2',
    type    : 2,
    def     : 20,
    bye     : 45
}));
window.game.items.push(createItem('Меч', 1, 3, 9, 0, 0, 100)); // 9




var createMob = function(name, hp, dmg, exp, img )
{
    return {
        name    : name,
        hp      : hp,
        dmg     : {
            min     : dmg,
            max     : (dmg * 2 )
        },
        exp     : exp,
        img     : img
    }
};



window.game.mobs = [];

window.game.mobs.push(createMob('Дракон', 100, 5, 50, '1'));
window.game.mobs.push(createMob('Берсерк', 100, 5, 50, '2'));
window.game.mobs.push(createMob('Ракета', 100, 5, 50, '3'));
window.game.mobs.push(createMob('Покемон', 100, 5, 50, '4'));
window.game.mobs.push(createMob('Бычёк', 100, 5, 50, '5'));
window.game.mobs.push(createMob('Призрак скелета', 100, 5, 50, '6'));
window.game.mobs.push(createMob('Гидра', 100, 5, 50, '7'));
window.game.mobs.push(createMob('Драконафт', 100, 5, 50, '8'));
window.game.mobs.push(createMob('Рептилоид', 100, 5, 50, '9'));
window.game.mobs.push(createMob('Всадник', 100, 5, 50, '10'));
window.game.mobs.push(createMob('Павук', 100, 5, 50, '11'));
window.game.mobs.push(createMob('Варвар', 100, 5, 50, '12'));
window.game.mobs.push(createMob('Зомби', 100, 5, 50, '13'));
window.game.mobs.push(createMob('Пенёк', 100, 5, 50, '14'));

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


window.game.props       = {
    x : {
        speed   : 1,
        // full HP * за минут
        regen   : 10,
        gold    : 1,
        sell    : 1,
        bye     : 1,
        hp      : 1
    },
    itemTypes : {
        0 : "chest",
        1 : "main hand",
        2 : "second hand",
        3 : "trash",
        4 : "potion",
        5 : "quests"
    },

    // таблица уровней
    levels  : [0, 50, 150, 300, 500, 750, 1000, 1500, 3000, 5000, 10000 ]
};



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