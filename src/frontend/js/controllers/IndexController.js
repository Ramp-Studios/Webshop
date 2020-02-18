const api = new API();

window.addEventListener('load', () => {
    let index = new Index();
    index.init();
});

class Index {
    constructor() {
        this.loginComponent = new Login(api.isAuthenticated);
        this.productsComponent = new Products();
    }

    async init() {
        document.getElementById("login").append(this.loginComponent.getView());
        //fuck this line. useful if we rewrite it for other shit. but fuck this line
        //document.querySelector("main").append(this.productsComponent.getView());

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
            }
            catch (err) {
                api.logoutUser();
                console.log(err)
                window.location = '/';
            }
        }
    }
}
