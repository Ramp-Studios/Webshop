const api = new API();

window.addEventListener('load', () => {
    let admin = new Admin();
    admin.init();
});

class Admin {
    constructor() {
        this.loginComponent = new Login(api.isAuthenticated);
    }

    async init() {
        document.getElementById("header").append(this.loginComponent.getView());

        // Check with the api if there is already al auth token.
        if (api.isAuthenticated) {
            // Get the logged in user
            try {
                let userData = await api.getUser()
                let userElements = document.getElementsByClassName('current-user');
                // If succeded render name at all the current-user locations by class
                for (let element of userElements) {
                    element.innerText = userData.name;
                }
            } catch (err) {
                api.logoutUser();
                console.log(err)
                window.location = '/';
            }
        }

        // Add a product
        let formAddProduct = document.getElementById("addProduct");
        formAddProduct.addEventListener("submit", async (evt) => {
            evt.preventDefault();
            let form = document.getElementById("addProduct");
            let formData = new FormData(form);
            for (let p of formData) {
                console.log(p);
            }
            try {
                const data = await api.addProduct(formData);
                console.log(data);
                window.location = '/';
            }
            catch (err) {
                console.error(err);
                formAddProduct.setAttribute("class", "error");
            }
        });

        // Restock a product
        let formRestock = document.getElementById("restockProduct");
        formRestock.addEventListener("submit", async (evt) => {
            evt.preventDefault();
            console.log("Restocking");
            let productId = document.getElementById("restockProductId").value;
            let quantity = document.getElementById("restockQuantity").value;
            api.restockProduct(productId, quantity);
            try {
                const data = await api.restockProduct(productId, quantity);
                console.log(data);
                window.location = '/';
            }
            catch (err) {
                console.error(err);
                formRestock.setAttribute("class", "error");
            }
        });

        // Delete a product
        let formDelete = document.getElementById("deleteProduct");
        console.log(formDelete);
        formDelete.addEventListener("submit", async (evt) => {
            evt.preventDefault();
            console.log("Deleting");
            let productId = document.getElementById("deleteProductId").value;
            try {
                const data = await api.deleteProduct(productId);
                console.log(data);
                window.location = '/';
            }
            catch (err) {
                console.error(err);
                formDelete.setAttribute("class", "error");
            }
        });
    }
}
