
// type
// 0 chest
// 1 main hand
// 2 second hand
// 3 bugs
// 4 quest
// 5 trash
var createItem = function(/*name, type, img, dmg, def, slots, bye*/ )
{
    var path = [
        'img/items/chest/',
        'img/items/main_hand/',
        'img/items/second_hand/',
        'img/items/bugs/',
        'img/items/quest/',
        'img/items/trash/'
    ];

    var prop = function( obj, type, id, def ) {

        return  ( obj[1] == undefined && obj[0][type] ) ? obj[0][type] : ( obj[id] == undefined ) ? def : obj[id];
    };

    var x = arguments;

    var type    = prop(x, 'type', 1, 0),
        dmg     = prop(x, 'dmg', 3, 0),
        bye     = prop(x, 'bye', 6, 0),
        sell    = ( x[1] == undefined && x[0]['sell'] != undefined ) ? x[0]['sell'] : ( bye / 2 );

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
        sell    : sell
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

window.game.items.push(createItem({ // 10
    name    : 'Щит война',
    img     : '2',
    type    : 2,
    def     : 20,
    bye     : 45
}));

window.game.items.push(createItem({ // 11
    name    : 'Просто камень',
    img     : '1',
    type    : 5,
    bye     : false,
    sell    : 10
}));
window.game.items.push(createItem({ // 12
    name    : 'Большой камень',
    img     : '2',
    type    : 5,
    bye     : false,
    sell    : 15
}));
window.game.items.push(createItem({ // 13
    name    : 'Красивый камень',
    img     : '3',
    type    : 5,
    bye     : false,
    sell    : 20
}));
window.game.items.push(createItem({ // 14
    name    : 'Супер камень',
    img     : '4',
    type    : 5,
    bye     : false,
    sell    : 30
}));
window.game.items.push(createItem({ // 15
    name    : 'Драгоценный камень',
    img     : '5',
    type    : 5,
    bye     : false,
    sell    : 50
}));

