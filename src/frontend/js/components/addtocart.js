const Searchbar = window.location.search;
const ProductIDSearch = Searchbar.replace("?product=a","");
let productsincartrefresh = 0;

loadproductsincart()

async function loadproductsincart() { //Load the products all once
    if(api.hasToken()){
        let cart = await api.getCart(localStorage.getItem('token'));

        for(let i = 0; i < cart.products.length; i++){
            productsincartrefresh += cart.products[i].amount
        }
    }
}

function addproduct(){ //Adds single product to cart
    productsincartrefresh += 1;
}

if(window.location.pathname == "/" || window.location.pathname == "/index.html" || window.location.pathname == '/productlist.html'){
    if(api.hasToken()){
        setTimeout(() => {
            let Button2 = document.getElementsByClassName("product-add-to-ww")
    
            for(let i = 0; i < Button2.length; i++) {
                Button2[i].addEventListener("click", async (evt) => {
                    evt.preventDefault();
                    try {
                        let response2 = await api.addToCart(Button2[i].name.slice(1), token);

                        addproduct()
                        setTimeout(() => { //Changes the number next to cart +1 when clicking once
                            let cartitems = document.getElementById("cart-items")
                            cartitems.innerHTML = `
                                    <i id="cart-items" href='/checkout.html'>${productsincartrefresh} items<i>
                                `
                        }, 60);
                    }
                    catch (err) {
                        console.error(err);
                    }
                });
            }
        }, 1000);
    }
} else {
    if(api.hasToken()){
        let Button = document.getElementById("product-add-to-ww");
        Button.addEventListener("click", async (evt) => {
            evt.preventDefault();
            try {
                let response = await api.addToCart(ProductIDSearch, token);

                addproduct()
                setTimeout(() => { //Changes the number next to cart +1 when clicking once
                    let cartitems = document.getElementById("cart-items")
                    cartitems.innerHTML = `
                            <i id="cart-items" href='/checkout.html'>${productsincartrefresh} items<i>
                        `
                }, 60);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}