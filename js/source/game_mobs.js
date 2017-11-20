
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