import axios from "axios";
import { Success, Danger, clearLocalStorage } from "./request";

export function SendData(){
    
    const TOKEN = '6304428329:AAEgyRD2JY9eA1aw0LfHev91x06wTvCfuGw';
    const CHAT_ID = '-1001641848532';
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    const spinner = document.querySelector('.spinner');
    const btnSbm = document.querySelector('#form');

    function showSpinner(){
        spinner.classList.add('spinner-active');
    }
    function hideSpinner(){
        spinner.classList.remove('spinner-active');
    }
    btnSbm.addEventListener("submit", (e) => {
        e.preventDefault();
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        const UserInfo = JSON.parse(localStorage.getItem("user"));
        
        if(savedCart.products == 0){
            alert("Ваша корзина пуста");
        }else {
            let aboutUser = `<b>Нове замовлення!</b>\n<b>Ім'я:</b> <pre>${UserInfo.name}</pre>\n<b>Телефон:</b> <pre>${UserInfo.phone}</pre>\n\n`;
        
            let orderInfo = savedCart.products.reduce((total, target) => {
            return total += `<b>${target.name} ${target.subtitle}: ${target.amount} шт.</b>\n`
        },``);
        
                let message = aboutUser + orderInfo;
                if(UserInfo.textaddress){
                    message += `\n<b>Адреса:</b> <pre>${UserInfo.textaddress}</pre>\n`;
                }
                if(UserInfo.comment){
                    message += `<b>Побажання:</b> <pre>${UserInfo.comment}</pre>\n`;
                }
                showSpinner();
                axios.post(URI_API, {
                    chat_id: CHAT_ID,
                    parse_mode: 'html',
                    text: message
                }).then(function (response) {
                    hideSpinner();
                    Success();
                    clearLocalStorage();
                    btnSbm.reset();
                }).catch(function(error){
                    hideSpinner();
                    Danger();
                })  
        }
        

    })
}