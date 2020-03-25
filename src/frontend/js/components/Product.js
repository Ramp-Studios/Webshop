class Product extends Component {

    //model
    constructor(data) {
        super("article");
        data._id = 'a'+data._id;
        this.id = data._id; //Hier was substring 1 van docenten sheyt
        this.name = data.name;
        this.brand = data.brand;
        this.images = data.images;
        this.description = data.description;
        this.price = data.price;
        this.quantityInStock = data.quantityInStock;
        this.reviews = data.reviews;
        this.initView(data.type);
    }

    voegProductInProductList(nameOfList, product) {
        alert("Voeg toe");
    }

    initView(type) {
        let rating = 5;
        if (!this.reviews[0]) rating = 3
        else {
            let totalratings = 0;
            for (let i = 0; i < this.reviews.length; i++) {
                totalratings += this.reviews[i].rating;
            }
            rating = totalratings / this.reviews.length;
        }
        this.rootElement.innerHTML = `
            <img src="${this.images[0] ? this.images[0] : "../../img/productplaceholder.jpg"}">
            <div style="height: 100%; display: flex;">
                <a href="/product.html?product=${this.id}" style="margin-left: 10px; font-weight: 700;">${this.name}</a>
                <span>
                    ${this.description.length < ((!type || type === 'top10') ? 90 : 55) ? this.description : this.description.slice(0, ((!type || type === 'top10') ? 80 : 45)) + `... <a href="/product.html?product=${this.id}">Lees meer</a>`} 
                </span>
                <span ${type ? `style="position: fixed; bottom: 64px;"` : ''}>€${this.price.toFixed(2)}</span>
                <div style="${type ? `position: fixed; bottom: 37px;` : ''} display: flex">
                    <span style="color: ${rating >= 1 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 1.5 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 2.5 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 3.5 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 4.5 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="font-size: 1rem; margin-top: 0.8rem;">(${this.reviews.length})</span>
                </div>
                <div>
                    <button class="product-add-to-ww addtocart" name="${this.id}" ${type ? `style="position: fixed; bottom: 15px;"` : ''}><i class="fas fa-shopping-basket"></i> Add to cart</button>
                </div>
            </div>
        `;
        // document.getElementById(this.id).addEventListener('click', () => {
        //     this.voegProductInProductList(1, 2);
        // });
    }
}
