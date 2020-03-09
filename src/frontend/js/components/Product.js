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
        this.initView();
    }

    voegProductInProductList(nameOfList, product) {
        alert("Voeg toe");
    }

    initView() {
        let rating = 5;
        if (!this.reviews[0]) rating = 3 
        this.rootElement.innerHTML = `
            <img src="${this.images[0] ? this.images[0] : "../../img/productplaceholder.jpg"}">
            <div>
                <a href="/product.html?product=${this.id}">${this.name}</a>
                <span>
                    ${this.description.length < 100 ? this.description : this.description.slice(0, 90) + `... <a href="/product.html?product=${this.id}">Lees meer</a>`} 
                </span>
                <span>€${this.price}</span>
                <div>
                    <span style="color: ${rating >= 1 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 2 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 3 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 4 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span style="color: ${rating >= 5 ? "rgb(255, 225, 0)" : "rgb(51, 51, 51)"};">⋆</span>
                    <span>(${this.reviews.length})</span>
                </div>
                    <button id="product-add-to-ww" class="addProduct">🛒 Add to cart</button>
                </div>
            </div>
        `;
        // document.getElementById(this.id).addEventListener('click', () => {
        //     this.voegProductInProductList(1, 2);
        // });
    }
}
