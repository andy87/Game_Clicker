
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

                $( '#reward' ).draggable({ handle: '.b-reward__title' });

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






