load('top10');
load('last10');
load('newest10');
dagdealtimer();
function dagdealtimer() {
    const timer = document.getElementById('dagdealtimer')
    let now = new Date().getTime();
    let end = new Date()
    end.setUTCHours(23)
    end.setUTCMinutes(0)
    end.setUTCSeconds(0)
    end = end.getTime();
    let timeleft = end - now;
    let hours = Math.floor(timeleft / 60 / 60 / 1000);
    timeleft = timeleft - hours * 60 * 60 * 1000;
    let minutes = Math.floor(timeleft / 60 / 1000);
    timeleft = timeleft - minutes * 60 * 1000;
    let seconds = Math.floor(timeleft / 1000);
    timer.innerHTML = `${hours}:${minutes}:${seconds}`;
} 
setInterval(() => {
    dagdealtimer();
}, 1000);

async function load(soort) {
    const response = await fetch((`./api`), {
        method: 'GET',
        headers: {
            'Content-type': 'json/application',
            'get': soort
        }
    })
    const data = JSON.parse(await response.json());
    let done = 0;
    let carousel
    if (soort === 'top10') carousel = document.getElementById('aanbevolen-carousel').children;
    else if (soort === 'last10') carousel = document.getElementById('laatstbekeken-carousel').children;
    else if (soort === 'newest10') carousel = document.getElementById('laatsttoegevoegd-carousel').children;
    else return;
    for (let element in data) {
        //getting item and section
        const item = data[element]
        let ratings;
        let stars;
        if (item.reviews) {
            item.reviews.forEach((review) => {
                ratings++;
                stars += review.stars;
            })
            stars = Math.round(stars / ratings);
        } else {
            stars = 3;
            ratings = 0;
        }
        const section = carousel[done]
        //making image
        const image = section.appendChild(document.createElement('img'))
        image.src = item.image;
        //making div for text
        const div = section.appendChild(document.createElement('div'))
        //making name
        const name = div.appendChild(document.createElement('a'))
        name.setAttribute('href', `/product.html?product=${item.name}`)
        name.innerHTML = item.name;
        //making description
        const desc = div.appendChild(document.createElement('span'))
        if (item.description.length >= (soort === 'last10' ? 65 : 105)) {
            desc.innerHTML = item.description.slice(0, (soort === 'last10' ? 65 : 105)) + '... '
            const leesmeer = desc.appendChild(document.createElement('a'));
            leesmeer.innerHTML = 'Lees meer'
            leesmeer.setAttribute("href", `/product.html?product=${item.name}`)
        } else {
            desc.innerHTML = item.description;
        }
        //making price
        const price = div.appendChild(document.createElement('span'))
        price.innerHTML = '€' + item.price;
        //making review
        const rating = div.appendChild(document.createElement('div'))
        //adding stars inside the rating
        let i = 1;
        while (i <= 5) {
            const star = rating.appendChild(document.createElement('span'))
            star.innerHTML = '⋆'
            if (stars >= i) star.style.color = '#ffe100';
            else star.style.color = '#333';
            i++;
        }
        const amountofratings = rating.appendChild(document.createElement('span'))
        amountofratings.innerHTML = `(${ratings})`
        //making button
        const button = div.appendChild(document.createElement('button'))
        button.innerHTML = '🛒 Add to cart'
        done ++;
    }
}