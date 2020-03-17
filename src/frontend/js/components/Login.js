class Login extends Component {

    constructor(isLoggedIn) {
        super(isLoggedIn ? "span" : "form");
        this.isLoggedIn = isLoggedIn;
        this.initView();
    }

    initView() {
        let id = "log-out";
        let innerHTML = "Log out";
        let event = "click";
        if (!this.isLoggedIn) {
            event = "submit";
            id = "login";
            innerHTML = `
            <input type="text" placeholder="E-mail" name="email" id="email" value="">
            <input type="password" placeholder="Password" E-mail" name="password" id="password" value="">
            <input class="button" type="submit" value="Login">
            <a class="button" href = "/register.html">Register</a>`
        }

        if (this.isLoggedIn) this.rootElement.style = 'background-color: #008cba; border-radius: 0.25rem; color: white; text-decoration: none; font-weight: 700; margin: 0.25rem; margin-top: auto; margin-bottom: auto;padding: 0.5rem 1rem;'
        this.rootElement.id = id;
        this.rootElement.innerHTML = innerHTML;
        this.rootElement.addEventListener(event, (e) => this.onEvent(e));
    }

    onEvent(e) {
        if (this.isLoggedIn) {
            api.logoutUser();
            window.location = '/';
        }
        else {
            e.preventDefault();
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;
            api.loginUser(email, password)
                .then((response) => {
                    window.location = '/';
                })
                .catch((err) => {
                    console.log(err);
                    this.rootElement.setAttribute("class", "error");
                });
        }
    }
}