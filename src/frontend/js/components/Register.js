const token = localStorage.getItem('token');

if(!token){
    let element = document.getElementById("register")
    let para = document.createElement("div");
    para.innerHTML = `
    <form id="addUser" name="register" action="/action_page.php">
        Register:
        <!-- Name -->
        <br><label for="name">name:</label><br>
        <input type="text" id="name" name="name"><br><br>

        <!-- email -->
        <br><label for="email">email:</label><br>
        <input type="text" id="email" name="email"><br><br>

        <!-- password -->
        <br><label for="password">password:</label><br>
        <input type="text" id="password" name="password"><br><br>
        <input type="submit" value="Submit">
    </form> 
    `
    element.appendChild(para);

    let formAddReview = document.getElementById("addUser");
    formAddReview.addEventListener("submit", async (evt) => {
        evt.preventDefault();
        let form = document.getElementById("addUser");
        let formData = new FormData(form);
        try {
            var name = document.forms["register"]["name"].value;
            var email = document.forms["register"]["email"].value;
            var password = document.forms["register"]["password"].value;
            try {
                console.log(api)
                var response = await api.createUser(name, email, password);
                if (response.errors && response.errors[0]) {
                    alert(response.errors[0].msg)
                } else{
                    window.location.href = "/";
                }
                //alert(response);
                return response;
              } catch (e) {
                console.log(e);
            }
        }
        catch (err) {
            console.log(err);
            formAddReview.setAttribute("class", "error");
        }
    });
}