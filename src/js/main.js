import { Burger } from "./burger";
import { InitWow } from "./init-wow";
import { isMobile, isEmptyCart, formCheckout } from "./request";
import { SendData } from "./sendData";
import { UserInfo } from "./userInfo";
import { interactWithProducts } from "./work-with-products";
import {fetchProductsWithCategory} from  "./showData";


window.addEventListener("DOMContentLoaded", () => {
isMobile();


  const allLi = document.querySelectorAll('.product-categories-list li');
  const isPC = () => document.querySelector('body').classList.contains('_pc') ? true : false;
  function removeActive(list) {
         list.classList.remove(...list.classList)
         list.children[1].classList.remove('active'); 
  }
  function addActive(list){
      if(!isPC()){
          list.classList.add('activeMob');
      }else {
          list.classList.add('active');
          list.children[1].classList.add('active');
      }
  }

addActive(allLi[1]);

  allLi.forEach((li, index) => {
      li.addEventListener('click', (e) => {
          allLi.forEach(list => {
              removeActive(list);
          });

          addActive(li);

          fetchProductsWithCategory(index + 1)
            .then(() => {
                interactWithProducts();
                isEmptyCart();
  });
          
      })
  })

  fetchProductsWithCategory(2)
      .then(() => {
        interactWithProducts();
        isEmptyCart();
  });
  
  formCheckout();
  SendData();

  UserInfo();
      Burger();
      InitWow();

})