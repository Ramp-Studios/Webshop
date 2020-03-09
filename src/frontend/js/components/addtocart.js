const queryString2 = window.location.search;
const cleanString2 = queryString.replace("?product=a","");
const token2 = localStorage.getItem('token');

if(api.hasToken()){
    console.log
    let Button = document.getElementById("product-add-to-ww");
    Button.addEventListener("click", async (evt) => {
        evt.preventDefault();
        try {
            let response = await api.addToCart(cleanString2, token2);
            //location.reload();
        }
        catch (err) {
            console.error(err);
        }
    });
}