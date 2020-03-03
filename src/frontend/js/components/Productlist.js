loadlist();
function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2]);
}

async function loadlist() {
    let response = await fetch((`./api/products`), {
        method: 'GET',
        headers: {
            'Content-type': 'json/application',
        }
    })
    response = (await response.json()).products;
    const name = getParameterByName('q');
    let categories = getParameterByName('c')
    if (categories) categories = categories.split("+")
    response = response.filter((product) => {
        if (name) {
            if (product.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
                if (categories && categories[0]) {
                    if (categories.includes(product.category.toLowerCase())) return true;
                } else {
                    return true;
                }
            }
        } else if (categories && categories[0]) {
            if (categories.includes(product.category.toLowerCase())) return true;
        } else {
            return true;
        }
        return false;
    })
    const main = document.getElementById('productlist')
    response.forEach((product) => {
        const newdiv = new Product(product)
        newdiv.rootElement.className = 'productlistitem'
        main.appendChild(newdiv.rootElement)
    })
}