var request = new XMLHttpRequest()

request.open('GET', './api/products', true) //Get all products
request.onload = function() {
  fetch('./api/products')
  .then(response => response.json()) //Put all products in a json
  .then(data => {
    product = data.products[2] //Only first product of array
    voorraad = product.quantityInStock //Only first product of array

    document.getElementById("prijs").innerHTML=`€ ${product.price}`; //Replace the html with the ID "prijs" with the product price
    document.getElementById("product-naam").innerHTML=`${product.name}`;
    document.getElementById("category").innerHTML=`Category: ${product.category}`;
    document.getElementById("reviews").innerHTML=`Reviews: ${product.reviews.length}`;
    document.getElementById("description").innerHTML=`${product.description}`;
    document.getElementById("image0").src = product.images[0] || 'https://i.imgur.com/MhpCHIj.png';
    document.getElementById("image1").src = product.images[1] || 'https://i.imgur.com/MhpCHIj.png';
    document.getElementById("image2").src = product.images[2] || 'https://i.imgur.com/MhpCHIj.png';

    if(voorraad <= 0){
      document.getElementById("voorraad").innerHTML=`Niet op voorraad`;
      document.getElementById("voorraad").id=`nietopvoorraad`;
      document.getElementById("product-add-to-ww").disabled = true;
    }
    console.log(`${product.reviews.length}`)//Testing purposes
    console.log(`Product id: ${product._id}`)
  })
}
request.send()
