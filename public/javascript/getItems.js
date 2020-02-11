async function fetchItem(name) {

    const response = await fetch((`./api`), {
        method: 'GET',
        headers: {
            'Content-type': 'json/application',
            'item': name
        }
    })
    console.log(await response.json());
}

async function recentItems() {
    const response = await fetch((`./api`), {
        method: 'GET',
        headers: {
            'Content-type': 'json/application',
            'get': 'last10'
        }
    })
    console.log(await response.json());
}