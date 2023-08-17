import axios from "axios";
import { Success, Danger, clearLocalStorage } from "./request";

export function SendData(){
    

    var URI_API = 'https://artichecker.com/BBQ-Smoker/api/sendRequest';

    const spinner = document.querySelector('.spinner');
    const form = document.querySelector('#form');



    function showSpinner(){
        spinner.classList.add('spinner-active');
    }
    function hideSpinner(){
        spinner.classList.remove('spinner-active');
    }


    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        const UserInfo = JSON.parse(localStorage.getItem("user"));
        
        console.log(savedCart.products)
        if(savedCart.products == 0){
            alert("Ваша корзина пуста");
        }
        else {
            if (!form.checkValidity()) {
                e.stopPropagation()
                console.log('Nothing good');
            } else {
                let CheckOutData = {
                    cart: savedCart.products,
                    order: {...UserInfo, deliveryOption: $('input[name="delivery-option"]:checked').val()}
                }
                console.log(CheckOutData);
                showSpinner();
                axios.post(URI_API, CheckOutData)
                    .then(function (response) {
                        hideSpinner();
                        Success();
                        clearLocalStorage();
                        $('#form').removeClass('was-validated')
                        form.reset();
                    }).catch(function(error){
                        hideSpinner();
                        if (error.response && error.response.status === 400 
                            && error.response.data
                            && error.response.data.error ) {
                                
                            console.log(error.response.data.error);

                            Danger("" + error.response.data.error);
                        } else {
                            Danger('Error 500. Помилка серверу');
                        }
                    }) 
            }

            $('#form').addClass('was-validated')
        }
            
    })

}