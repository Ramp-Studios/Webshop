var request = new XMLHttpRequest()
placeholder = "https://i.imgur.com/MhpCHIj.png"

request.open('GET', './api/products', true) //Get all products from api
request.onload = function() {
  fetch('./api/products')
  .then(response => response.json()) //Put all products in a json
  .then(data => {
    let product = data.products//Only first product of array
    let queryString = window.location.search;
    let cleanString = queryString.replace("?product=a","");

    for (var i = 0; i < product.length; i++){ //For loop of the json
      if (product[i]._id == cleanString){ //Find product id that matches this url id
        voorraad = product[i].quantityInStock;
        //descriptionspace = product[i].description.split(".").join(".<br>");
        //document.getElementById("description").innerHTML= descriptionspace;
        document.getElementById("prijs").innerHTML=`€ ` + product[i].price.toFixed(2); //Replace the html with the ID "prijs" with the product price
        document.getElementById("product-naam").innerHTML=`${product[i].name}`;
        document.getElementById("category").innerHTML=`Category: ${product[i].category}`;
        document.getElementById("reviews").innerHTML=`Reviews: ${product[i].reviews.length}`; //Only takes the amound of reviews for now
        document.getElementById("description").innerHTML= product[i].description;
        document.getElementById("image0").src = product[i].images[0] || placeholder;
        document.getElementById("image1").src = product[i].images[1] || placeholder;
        document.getElementById("image2").src = product[i].images[2] || placeholder;

        if(voorraad <= 0){ //If not in stock display "Niet op voorraad" en disable add to ww button 
          document.getElementById("voorraad").innerHTML=`Niet op voorraad`;
          document.getElementById("voorraad").id=`nietopvoorraad`;
          document.getElementById("product-add-to-ww").disabled = true;
        }
      }
    }
  })
}
request.send()
