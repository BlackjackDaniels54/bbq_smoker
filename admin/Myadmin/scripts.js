import { GetAllData} from "./modules/requests";
import {clickTabs } from "./modules/Tabs";

window.addEventListener("DOMContentLoaded", (e) => {

   GetAllData()
        .then(data => {
            
            clickTabs();
            
        })

})