function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const currentSearch = getParameterByName('q')
document.getElementById("nav").innerHTML = `
        <div class="dropdown">
            <button class="dropbtn">☰</button>
            <div class="dropdown-content">
                <a href="../">Homepage</a>
                <a href="../productlist.html?c=elektronika">Elektronika</a>
                <a href="../productlist.html?c=elektronika%20kits">Elektronika kits</a>
                <a href="../productlist.html?c=boeken">Boeken</a>
                <a href="../productlist.html?c=robotica">Robotica</a>
                <a href="../productlist.html?c=gereedschap">Gereedschap</a>
    
            </div>
        </div>
        <a href="/"><img src="https://i.imgur.com/MhpCHIj.png"></a>
        <div class="search-container">
            <div class="dropdown">
                <button class="dropbtn"><img src="./img/drop-down-arrow.png" style="height: 31px" alt=""></button>
                <div class="dropdown-content" id="search-categories">
                    <label class="container">
                        <input type="checkbox"><a>Elektronika</a>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <input type="checkbox"><a>Elektronika Kits</a>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <input type="checkbox"><a>Boeken</a>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <input type="checkbox"><a>Robotica</a>
                        <span class="checkmark"></span>
                    </label>
                    <label class="container">
                        <input type="checkbox"><a>Gereedschap</a>
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            <form id="search">
                <input type="text" placeholder=" Search.." name="search">
            </form>
        </div>
        <div style="flex-grow: 0.5;" id="login"></div>
        <div id="ww"></div>
        <div> 
            <button style="width: 48px; height: 48px; margin: 1px;"><img src="https://cdn.icon-icons.com/icons2/1744/PNG/512/3643737-cart-drop-shop-shopping-trolly_113425.png" style="height: 100%; width: 100%;" alt="Winkel Wagen"></button>
        </div>`

const searchbar = document.getElementById('search');
searchbar.children.search.value = currentSearch;

function submitting(event) {
    event.preventDefault()
    const searchterm = searchbar.children.search.value;
    const categories = (document.getElementById('search-categories')).children
    let enabledcats = [];
    for (let cat of categories) {
        if (cat.control.checked) {
            enabledcats.push(cat.children[1].text.toLowerCase());
        }
    }
    if (searchterm && enabledcats && enabledcats[0]) window.location.href = `productlist.html?q=${searchterm}&c=${enabledcats.join("+")}`;
    else if (searchterm) window.location.href = `productlist.html?q=${searchterm}`;
    else if (enabledcats && enabledcats[0]) window.location.href = `productlist.html?c=${enabledcats.join("+")}`;
    else window.location.href = `productlist.html`; 
}
searchbar.addEventListener('submit', submitting);