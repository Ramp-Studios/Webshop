class Product extends Component {

    //model
    constructor(data) {
        super("article");
        this.id = data._id.substring(1);
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
            <img src="${this.images[0] ? this.images[0] : "https://i.imgur.com/MhpCHIj.png"}">
            <div>
                <a href="${this.id}">${this.name}</a>
                <span>
                    ${this.description.length < 100 ? this.description : this.description.slice(0, 90) + '<a href="/product.html?product=${this.id}">Lees meer</a>'} 
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
                    <button id="${this.id}" class="addProduct">🛒 Add to cart</button>
                </div>
            </div>
        `;

        this.getElementById(this.id).addEventListener('click', () => {
            this.voegProductInProductList(1, 2);
        });
    }
}
