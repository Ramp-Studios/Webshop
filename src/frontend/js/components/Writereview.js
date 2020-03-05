const queryString = window.location.search;
const cleanString = queryString.replace("?product=a","");
const token = localStorage.getItem('token');

if(token.length > 0){
    let element = document.getElementById("product-reviewform")
    let para = document.createElement("div");
    para.innerHTML = `
    <h2>Schrijf een review</h2>
    <form id="addReview" name="review" action="/action_page.php" onsubmit="myFunction()">
        Rating:
        <input type="radio" id="1" name="rating" value="1" required>
        <label for="1">1</label>
        <input type="radio" id="2" name="rating" value="2">
        <label for="2">2</label>
        <input type="radio" id="3" name="rating" value="3">
        <label for="3">3</label>
        <input type="radio" id="4" name="rating" value="4">
        <label for="4">4</label>
        <input type="radio" id="5" name="rating" value="5">
        <label for="5">5</label>
    
        <br><label for="review">Review:</label><br>
        <input type="text" id="text" name="text"><br><br>
        <input type="submit" value="Submit">
    </form> 
    `
    element.appendChild(para);

    let formAddReview = document.getElementById("addReview");
    formAddReview.addEventListener("submit", async (evt) => {
        evt.preventDefault();
        let form = document.getElementById("addReview");
        let formData = new FormData(form);
        for (let p of formData) {
            console.log(p);
        }
        try {
            var rating = document.forms["review"]["rating"].value;
            var text = document.forms["review"]["text"].value;
            let response = await api.createReview(text, rating, cleanString, token);
            location.reload();
        }
        catch (err) {
            console.error(err);
            formAddReview.setAttribute("class", "error");
        }
    });
}