class Loadproduct extends Component {
  constructor() {
    this.loadproduct();
  }

  loadproduct(){
    placeholder = "../../img/productplaceholder.jpg" //Placeholder img

    fetch('./api/products?limit=100000') //Get all products from api
    .then(response => response.json()) //Put all products in a json
    .then(data => {
      let product = data.products//Only first product of array
      let queryString = window.location.search;
      let cleanString = queryString.replace("?product=a","");

      for (let i = 0; i < product.length; i++){ //For loop of the json
        if (product[i]._id == cleanString){ //Find product id that matches this url id
          voorraad = product[i].quantityInStock;
          //descriptionspace = product[i].description.split(".").join(".<br>");
          //document.getElementById("description").innerHTML= descriptionspace;
          document.getElementById("prijs").innerHTML=`€ ` + product[i].price.toFixed(2); //Replace the html with the ID "prijs" with the product price
          document.getElementById("product-naam").innerHTML=`${product[i].name}`;
          document.getElementById("category").innerHTML=`Category: ${product[i].category}`;
          document.getElementById("description").innerHTML= product[i].description;
          document.getElementById("image0").src = product[i].images[0] || placeholder;
          document.getElementById("image1").src = product[i].images[1] || placeholder;
          document.getElementById("image2").src = product[i].images[2] || placeholder;

          let totalrating = 0;
          for(let z = 0; z < product[i].reviews.length; z++){
            totalrating += product[i].reviews[z].rating;
          }
          avaragereview = totalrating / product[i].reviews.length;

          for(let z = 0; z < product[i].reviews.length && z < 5; z++){ //Loop for reviews only display latest 5
            let productreviews = document.getElementById("product-reviews");
            let rating = document.createElement("p");
            rating.className = "productpage-review"
            rating.innerHTML = `Rating: ${product[i].reviews[z].rating} <br> Name: ${product[i].reviews[z].name} <br> Review: ${product[i].reviews[z].text}`;
            productreviews.appendChild(rating);
          }

          //Fullstar
          nostar = 5 - avaragereview;
          star = Math.floor(avaragereview)
          for(let z = 0; z <  star; z++){ 
            let element = document.getElementById("reviews");
            let para = document.createElement("a");
            para.setAttribute('href', '#product-reviews'); //link to review section
            para.setAttribute('class', 'fa fa-star');
            para.setAttribute('aria-hidden', 'true');
            element.appendChild(para);
          }

          //Half stars
          var decimal = avaragereview - Math.floor(avaragereview)
          if(decimal > 0.4 && decimal <= 0.9){
            nostar = nostar -1;
            let element = document.getElementById("reviews");
            let para = document.createElement("a");
            para.setAttribute('href', '#product-reviews'); //link to review section
            para.setAttribute('class', 'fa fa-star-half-o');
            para.setAttribute('aria-hidden', 'true');
            element.appendChild(para);
          }
          
          for(let z = 0; z < nostar; z++){ //Nostar
            let element = document.getElementById("reviews");
            let para = document.createElement("a");
            para.setAttribute('href', '#product-reviews'); //link to review section
            para.setAttribute('class', 'fa fa-star-o');
            para.setAttribute('aria-hidden', 'true');
            element.appendChild(para);
          }

          //No rating at all
          if(isNaN(avaragereview)){
            avaragereview = 0;
            for(c = 0; c < 5; c++){
              let element = document.getElementById("reviews");
              let para = document.createElement("a");
              para.setAttribute('href', '#product-reviews'); //link to review section
              para.setAttribute('class', 'fa fa-star-o');
              para.setAttribute('aria-hidden', 'true');
              element.appendChild(para);
            }
          }

          let element = document.getElementById("reviews");
          let para = document.createElement("a");
          para.setAttribute('href', '#product-reviews'); //link to review section
          para.innerHTML = ` ${avaragereview.toFixed(1)} gemiddelde gebaseerd op ${product[i].reviews.length} beoordelingen`
          element.appendChild(para);

          if(voorraad <= 0){ //If not in stock display "Niet op voorraad" en disable add to ww button 
            document.getElementById("voorraad").innerHTML=`Niet op voorraad`;
            document.getElementById("voorraad").id=`nietopvoorraad`;
            document.getElementById("product-add-to-ww").disabled = true;
          }
        }
      }
    })
  }
}