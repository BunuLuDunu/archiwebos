const loginForm = document.getElementById('form');

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            email : email, 
            password : password,
        }),
    });
    const loginInfo = await response.json();
    if(loginInfo.userId && loginInfo.token) {
        window.sessionStorage.setItem("token", loginInfo.token)
        window.location.href='./#porfotlio'
    }else {
        alert("Une erreur est survenue.")
    };
})