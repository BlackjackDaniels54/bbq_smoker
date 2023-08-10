export function UserInfo() {
    let name = document.querySelector('input[name="name"]');
    let phone = document.querySelector('input[name="phone"]');
    let text__area = document.querySelector("#exampleFormControlTextarea1");
    let comment = document.querySelector("#exampleFormControlTextarea2");
   
    let User = {};
    if (localStorage.getItem("user") == null) {
        localStorage.setItem("user", JSON.stringify(User));
    }

    name.addEventListener('change', (e) => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        savedUser.name = e.target.value.trim().substr(0, 50);
        localStorage.setItem("user", JSON.stringify(savedUser));
    });
    
    phone.addEventListener('change', (e) => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        savedUser.phone = e.target.value;
        localStorage.setItem("user", JSON.stringify(savedUser));
    })
   
    text__area.addEventListener('input', (e) => {
            const savedUser = JSON.parse(localStorage.getItem("user"));
            savedUser.textaddress = e.target.value.trim().substr(0, 150);
            localStorage.setItem("user", JSON.stringify(savedUser));
    })

    comment.addEventListener('input', (e) => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        savedUser.comment = e.target.value.trim().substr(0, 150);
        localStorage.setItem("user", JSON.stringify(savedUser));
    })

}