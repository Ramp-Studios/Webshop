placeholder = "../../img/productplaceholder.jpg"
let totaalprijs = 0;
let totaalproducten = 0;
let productsincart = 0;

loadWWbutton()

//Load checkout products
if(window.location.pathname == "/checkout.html"){
    loadCart()
}
async function loadCart() {
    if(api.hasToken()){
        let cart = await api.getCart(localStorage.getItem('token'));
        cart.products.forEach(async element => {
            if (element.amount > 0) {
                let x = await api.getProducts(element._id)
                let element1 = document.getElementById("ww-items")
                let para1 = document.createElement("div");
                totaalprijs += element.priceTotal;
                para1.innerHTML = `
                    <br>
                    <img class="ww-img" style="float: left; height: 10vh; width: 10vw;" src="${x.images[0] || placeholder}"></img>
                    <p> Naam product: ${element.name} </p>
                    <button onclick = "remove('${element._id}')" style="float: right; margin-right: 10px;">Remove one</button>
                    <button onclick = "remove('${element._id}', ${element.amount})" style="float: right; margin-right: 10px;">Remove all</button>
                    <p> Prijs: €${element.price.toFixed(2)} p.s. </p>
                    <p> Hoeveelheid: ${element.amount} </p>
                    <p> Prijs totaal: €${element.priceTotal.toFixed(2)} </p>
                    `
                element1.appendChild(para1);
            }
            totaalproducten += 1;
            if (totaalproducten === cart.products.length) {
                let element2 = document.getElementById("ww-totaal")
                let para2 = document.createElement("div");
                para2.innerHTML = `
                    <br>
                    <p>Prijs totaal: €${totaalprijs.toFixed(2)}</p>
                    <button onclick="alert('einde project')">Checkout</button>
                    `
                element2.appendChild(para2);
            }
        });
    }
}
async function remove(id, amount){
    let x = await api.removeFromCart(id, localStorage.getItem('token'), amount ? amount : null)
    location.reload();
}

//Nav winkelwagen button
async function loadWWbutton() {
    if(api.hasToken()){
        let cart = await api.getCart(localStorage.getItem('token'));

        for(let i = 0; i < cart.products.length; i++){
            productsincart += cart.products[i].amount
        }

        if(api.hasToken()){
            let element = document.getElementById("ww")
            let para = document.createElement("div");
            para.innerHTML = `
                <button id="Winkelwagen" onclick="window.location.href='/checkout.html'"><i aria-hidden="true" class="fas fa-shopping-cart"></i></button>
                <i id="cart-items" href='/checkout.html'>${productsincart} items<i>
            `
            element.appendChild(para);
        }
    }
}