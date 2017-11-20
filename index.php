<?php

$version = [
    'game'  => time(),
    'items' => time(),
    'mobs'  => time(),
    'css'   => time()
];

//$dev  = ( $_SERVER['HTTP_HOST'] != 'click.games.andy87' OR isset($_GET['test']) AND !$_GET['test'] ) ? "min." : '';
$dev    = '.';

?>


<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">
    <title>Кликер v0.01</title>


    <link rel="stylesheet" type="text/css" href="css/main<?=$dev?>css?v=<?= $version['game'] ?>">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

</head>
<body>

    <div id="wrapper">



        <div id="form">


            <div id="registration">
                <? include("tpl/form_registry.php"); ?>
            </div>


        </div>



        <div id="game">



            <div id="user-info">

                <div class="user-portrait">
                    <img class="user-pic" id="img_portrait" src="img/player/avatar/v1.jpg?load=false" >
                    <span class="user-level"></span>
                    <span class="reset" title="Начать с начала">✖</span>
                </div>

                <div class="user-status">
                    <span class="user-name"></span>
                    <div class="progress-bar">
                        <span class="progress-text"></span>
                        <span class="progress-line" style="width: 100%;"></span>
                    </div>
                </div>

            </div>



            <div id="profile" class="none">

                <a class="close-wrapper" href="#close">✖</a>

                <div class="profile-tilte">

                </div>

                <div class="profile-tabs">
                    <a class="tabs-item info" href="#profile-info" title="Информация">?</a>
                    <a class="tabs-item stats" href="#profile-stats" title="Статы">+</a>
                    <a class="tabs-item inventory" href="#profile-inventory" title="Инвентарь">#</a>
                </div>

                <div class="tabs-body" id="profile-info">
                    <? include("tpl/profile_info.php"); ?>
                </div>

                <div class="tabs-body none" id="profile-stats">
                    <? include("tpl/profile_stats.php"); ?>
                </div>

                <div class="tabs-body none" id="profile-inventory">
                    <? include("tpl/profile_inventory.php"); ?>
                </div>

            </div>



            <div id="location" class="place">

                <div class="location place" data-location="place">

                    <div class="build arena goTo" data-location="arena" title="Арена">Арена</div>

                    <div class="build shop goTo" data-location="shop" title="Магазин">Магазин</div>

                    <div class="build smith goTo" data-location="smith" title="Кузница">Кузница</div>

                </div>

                <div class="location arena none">
                    <span class="place_exit goTo" data-location="place"></span>
                    <? include("tpl/location_arena.php"); ?>
                </div>

                <div class="location shop none">
                    <span class="place_exit goTo" data-location="place"></span>
                    <? include("tpl/location_shop.php"); ?>
                </div>

                <div class="location smith none">
                    <span class="place_exit goTo" data-location="place"></span>
                    <? include("tpl/location_smith.php"); ?>
                </div>

            </div>



        </div>



    </div>

<script type="application/javascript" src="js/app<?=$dev?>js?v=<?= $version['game'] ?>"></script>
<script type="application/javascript" src="js/app.plugins<?=$dev?>js?v=<?= $version['game'] ?>"></script>

</body>
</html>
