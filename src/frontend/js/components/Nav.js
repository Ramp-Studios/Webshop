document.getElementById("nav").innerHTML = `
        <div class="dropdown">
            <button class="dropbtn">☰</button>
            <div class="dropdown-content">
                <a href="#">Homepage</a>
                <a href="#">Elektronika</a>
                <a href="#">Elektronika Kits</a>
                <a href="#">Games</a>
                <a href="#">Boeken</a>
            </div>
        </div>
        <a href="#"><img src="https://i.imgur.com/MhpCHIj.png"></a>
        <div class="search-container">
            <div class="dropdown">
                <button class="dropbtn"><img src="./img/drop-down-arrow.png" style="height: 31px" alt=""></button>
                <div class="dropdown-content">
                    <label class="container">
                        <input type="checkbox"><a>Elektronika</a>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <input type="checkbox"><a>Elektronika Kits</a>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <input type="checkbox"><a>Games</a>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <input type="checkbox"><a>Boeken</a>
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            <form action="/#">
                <input type="text" placeholder=" Search.." name=" search">
            </form>
        </div>
        <div id="login"></div>
        <div id="ww"></div>`