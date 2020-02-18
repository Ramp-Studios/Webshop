class Product extends Component {

    //model
    constructor(data) {
        super("article");
        this.id = data._id.substring(1);
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
        this.rootElement.innerHTML = `
            <h2>${this.brand}</h2>
            <img src="${this.images[0] ? this.images[0] : ""}" alt="">
            <p>${this.description}</p>
            <p>${this.price}</p>
            <button id="${this.id}" class="btn addProduct">voeg toe</button>
        `;

        this.getElementById(this.id).addEventListener('click', () => {
            this.voegProductInProductList(1, 2);
        });
    }
}
