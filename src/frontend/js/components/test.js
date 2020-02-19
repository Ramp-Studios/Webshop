var request = new XMLHttpRequest()

request.open('GET', './api/products', true)
request.onload = function() {
  fetch('./api/products')
  .then(response => response.json())
  .then(data => {
    var price = document.getElementById('prijs');
    item1 = data.products[0]
    item1prijs = data.products[0].prijs
    tmpObj.innerHTML='data.products[0].pr'

    console.log(data.products[0])
  })
}
request.send()
