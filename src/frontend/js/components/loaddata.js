load('top10');
load('last10');
load('newest10');
async function load(type) {
    let carousel;
    if (type === 'top10') carousel = document.getElementById('aanbevolen-carousel');
    else if (type === 'last10') carousel = document.getElementById('laatstbekeken-carousel');
    else if (type === 'newest10') carousel = document.getElementById('laatsttoegevoegd-carousel');
    else return;

    let response = await fetch((`./api/products`), {
        method: 'GET',
        headers: {
            'Content-type': 'json/application',
        }
    })
    response = (await response.json()).products;
    for (let i = 0; i < 10; i++) {
        const data = response[i];
        if (!data) break;
        const newdiv = new Product(data);
        newdiv.rootElement.className = 'carousel-cell'
        carousel.appendChild(newdiv.rootElement);
        
    }

    if (type === 'newest10') {
        var scr  = document.createElement('script'),
        head = document.head || document.getElementsByTagName('head')[0];
        scr.src = "js/ramp/flickity.pkgd.js";

        head.insertBefore(scr, head.firstChild);
    }
}