<?php ?>

<div class="room arena" id="arena">

    <div class="selector">

        <h5>Уровень сложности:</h5>

        <button class="noob" data-x="0.25" title="Специавльная кнопка для And_y87">Noob</button>

        <button class="easy" data-x="0.5">Easy</button>

        <button class="normal" data-x="1">Normal</button>

        <button class="hard" data-x="1.5">Hard</button>

        <button class="extreme" data-x="2">Extreme</button>

    </div>

    <div class="battle">

        <div class="block__hero">
            <img src="img/player/v1.jpg?load=false" id="battle_hero">
        </div>

        <div class="block__enemy">

            <div class="b-enemy__portrait">
                <span class="b-enemy__name"></span>

                <span class="b-enemy__hp">
                    <span class="hp__int"></span>
                    <span class="hp__bar"></span>
                </span>
            </div>

            <span class="b-enemy__border">
                <img src="img/effects/attack.gif" class="b-enemy__effect">
                <img src="img/mobs/1.png" class="b-enemy__img">
            </span>

        </div>

    </div>


    <div id="reward" class="block__reward">

        <div class="b-reward__wrapper">

            <div class="b-reward__title">
                Награда
            </div>

            <div class="b-reward__number gold">
                Золото:
                <span class="b-reward__val"></span>
            </div>

            <div class="b-reward__number exp">
                Опыт:
                <span class="b-reward__val"></span>
            </div>

            <div class="b-reward__loot">

            </div>

            <a href="/" class="b-reward__button">выйти из боя</a>

        </div>

    </div>

</div>
