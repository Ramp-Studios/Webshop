if(localStorage.getItem('token') <= 0){
    let element = document.getElementById("register")
    let para = document.createElement("div");
    para.id = "register-form";
    para.innerHTML = `
    <form class="register-div" id="addUser" name="register" action="/action_page.php">
        <h2>Register:</h2>
        <!-- Name -->
        <br><label class="register" for="name">Name:</label>
        <input type="text" id="name" name="name">

        <!-- email -->
        <br><label class="register" for="email">E-mail:</label>
        <input type="text" id="email" name="email">

        <!-- password -->
        <br><label class="register" for="password">Password:</label>
        <input type="password" type="text" id="password" name="password">

        <input type="submit" value="Submit" class="button">
    </form> 
    `

    element.appendChild(para);

    let formAddUser = document.getElementById("addUser");
    formAddUser.addEventListener("submit", async (evt) => {
        evt.preventDefault();
        let form = document.getElementById("addUser");
        let formData = new FormData(form);
        try {
            var name = document.forms["register"]["name"].value;
            var email = document.forms["register"]["email"].value;
            var password = document.forms["register"]["password"].value;
            try {
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
            formAddUser.setAttribute("class", "error");
        }
    });
}