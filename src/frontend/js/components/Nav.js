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
            <button class="dropbtn"><i aria-hidden="true" class="fas fa-bars"></i></button>
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
                <button class="dropbtn"><i aria-hidden="true" class="fas fa-sliders-h"></i></button>
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
        <p id="username"></p>
        <div style="flex-grow: 0.5;" id="login"></div>
        <div id="ww"></div>`

getusername();
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

async function getusername(){
    console.log("Test")
    if(localStorage.getItem('token').length > 1){
        console.log("Test2")
        let user = await api.getUser(localStorage.getItem('token'));
        let userelement = document.getElementById("username")
        userelement.innerHTML = `Logged in as: ${user.name}`
    }
}