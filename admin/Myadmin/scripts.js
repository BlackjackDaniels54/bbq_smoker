import { GetProducts } from "./modules/requests";
import { ShowData } from "./modules/ShowData";

window.addEventListener("DOMContentLoaded", (e) => {

    GetProducts()
        .then(data =>{
            ShowData(data);
            console.log(data);
        })

})