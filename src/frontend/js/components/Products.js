class Products extends Component {
    constructor() {
        super("section");
        this.initView();
    }

    async initView() {
        try {
            // Get de products van de server. Dit is een call naar een resource waarop we moeten wachten.
            let products = await api.getProducts();
            this.rootElement.innerHTML = `
                <h2>Products</h2>
                <p>
                ${JSON.stringify(products)} </p><br>
            `;

            for (let p of products.products) {
                let product = new Product(p);
                this.rootElement.append(product.getView());
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}
