class Component {
    constructor(element) {
        if (!element) console.log(this)
        this.rootElement = document.createElement(element);
    }
    getElementById(id) { 
        return this.rootElement.querySelector(`#${id}`);
    }

    initView() {
        this.rootElement.innerHTML = '<span> NOT IMPLEMENTED YET </span>'
    }

    getView() {
        return this.rootElement;
    }
}