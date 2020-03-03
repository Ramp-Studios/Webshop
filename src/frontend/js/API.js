class API {
    constructor() {
        this.url = 'http://localhost:5000/api'
        this.token;
        this.isAuthenticated = false;
        this.headers = {
            'Content-Type': 'application/json'
        }
        if (this.hasToken()) {
            this.setAuthToken(localStorage.getItem('token'));
        }
    }

    hasToken() {
        return localStorage.getItem('token') !== undefined || localStorage.getItem('token') !== '';
    }

    setAuthToken(token) {
        if (token) {
            this.token = token;
            this.headers["x-auth-token"] = this.token;
            this.isAuthenticated = true;
            localStorage.setItem('token', token);
        }
        else {
            this.token = null;
            delete this.headers["x-auth-token"];
            this.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    }

    async createUser(name, email, password) {
        let response = await this.postData(this.url + '/users', {
            name,
            email,
            password
        });
        if (response.ok) {
            let data = await response.json();
            console.log("Logged in");
            this.setAuthToken(data.token);
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }


    }

    async loginUser(email, password) {
        let response = await this.postData(this.url + '/auth', {
            email,
            password
        });
        if (response.ok) {
            let data = await response.json();
            console.log("Logged in");
            this.setAuthToken(data.token);
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }
    }

    logoutUser() {
        this.setAuthToken(null);
    }

    async getUser() {
        let response = await this.getData(this.url + '/auth');
        if (response.ok) {
            let data = await response.json();
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }
    }

    async getProducts() {
        let response = await this.getData(this.url + '/products');
        if (response.ok) {
            let data = await response.json();
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }
    }

    async restockProduct(id, quantity) {
        if (parseInt(quantity)) quantity = parseInt(quantity);
        else throw `Error: Invalid quantity ${quantity}`
        let response = await this.putData(this.url + '/products/' + id + '/restock', { quantity: quantity });
        if (response.ok) {
            let data = await response.json();
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }
    }

    async deleteProduct(id) {
        let response = await this.deleteData(this.url + '/products/' + id);
        if (response.ok) {
            let data = await response.json();
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }
    }

    async addProduct(formData) {
        let response = await this.postData(this.url + '/products', formData, true);
        if (response.ok) {
            let data = await response.json();
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }
    }

    //Create a review
    async createReview(text, rating, productid, token) {
        let response = await this.putData(this.url + '/products/' + productid + '/review', {
            "text": String(text),
            "rating": parseInt(rating)
        }, token);
        if (response.ok) {
            let data = await response.json();
            console.log("Send review");
            return data;
        }
        else {
            throw `Error: ${response.status} ${response.statusText}`;
        }
    }

    // API Data calls GET, POST, PUT, DELETE
    postData(url = '', data = {}, isFormData = false) {
        let request = {
            method: 'POST'
        };
        if (!isFormData) {
            request.headers = this.headers;
            request.body = JSON.stringify(data);
        }
        else {
            delete this.headers['Content-Type'];
            request.headers = this.headers;
            request.body = data;
        }
        // Default options are marked with *
        return fetch(url, request);
    }

    getData(url = '') {
        // Default options are marked with *
        return fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: this.headers
        });
    }

    putData(url = '', data = {}, token) {
        // Default options are marked with *
        return fetch(url, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: token ? {
                'Content-Type': 'application/json',
                'x-auth-token': token
            } : this.headers,
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
    }

    deleteData(url = '', data = {}) {
        // Default options are marked with *
        return fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: this.headers,
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
    }
}