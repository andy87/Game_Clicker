<?php ?>



<form action="/" class="form registry">

    <h1>Добро пожаловать в игру</h1>

    <label>
        Ник:
        <input type="text" id="reg-nickname" maxlength="21">
    </label>
    <button type="submit">
        Начать игру
    </button>

    <br>

    <div>
        Аватар:
        <label>
            <input type="radio" value="1" name="avatar" checked>
             Солнце
        </label>
        <label>
            <input type="radio" value="2" name="avatar">
            Воздух
        </label>
        <label>
            <input type="radio" value="3" name="avatar">
            Сакура
        </label>

        <br>

        <img src="img/player/v1.jpg" width="200" id="reg_avatar">
    </div>

    <br>



</form>
