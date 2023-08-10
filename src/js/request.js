export async function GetProducts(){
    try {
        const response = await fetch('https://artichecker.com/BBQ-Smoker/api/getProducts');
        const goods = await response.json();

        return goods;
      } catch(error) {
          console.error('Ошибка при получении товаров:', error);
      }      
}

export async function getProductById(categoryId){
  try {

    const response = await fetch(`https://artichecker.com/BBQ-Smoker/api/getCategoryById/${categoryId}`);
    const category = await response.json();
    
    return category;

  } catch(error) {
      console.error('Ошибка при получении категорий:', error);
  }
}


export function isEmptyCart() {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  const cartNum = document.querySelector(".count-of-items");
  const cart = document.querySelector(".basket-icon");

  if(savedCart.products.length > 0) {

        cartNum.textContent = savedCart.products.length;
        cart.classList.add("active");
        cartNum.classList.add("active");
  }

}

export function isMobile(){
    if (/Android|webOS|iPhone|iPad|iPod|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    .test(navigator.userAgent)) 
    {
        document.querySelector('body').classList.add('_mobile');
       
    } else {
        document.querySelector('body').classList.add('_pc');
    } 
}


export function Success() {
    const circle = document.querySelector('.circle-loader'),
          checkmark = document.querySelector('.checkmark'),
          AlertSuccess = document.querySelector('.alert-success__container'),
          mainContainer = document.querySelector('.popup__container');

          AlertSuccess.classList.remove('hide-smooth-animation');

         

          setTimeout(function() {
            mainContainer.scrollTo({
                top: mainContainer.scrollHeight,
                behavior: "smooth"
              });
            }, 500);
          setTimeout(function() {
            circle.classList.add('load-complete');
            checkmark.style.display = 'block';
            }, 800);
          setTimeout(function() {
            circle.classList.remove('load-complete');
            checkmark.style.display = 'none';
            AlertSuccess.classList.add('hide-smooth-animation');
          }, 3500);
}

export function Danger() {
    
    const AlertSuccess = document.querySelector('.alert-danger__container'),
          mainContainer = document.querySelector('.popup__container');

          AlertSuccess.classList.remove('hide-smooth-animation');

          setTimeout(function() {
            mainContainer.scrollTo({
                top: mainContainer.scrollHeight,
                behavior: "smooth"
              });
            }, 500);

          setTimeout(function() {
            AlertSuccess.classList.add('hide-smooth-animation');
          }, 3500);

}

export function clearLocalStorage() {
  const cartNum = document.querySelector(".count-of-items");
  const cart = document.querySelector(".basket-icon");
    const popupProductList = document.querySelector("#popup_product_list");
    const popupCost = document.querySelector("#popup_cost");

    cart.classList.remove("active");
    cartNum.classList.remove("active"); 
    popupCost.innerHTML = '0 грн';
    popupProductList.innerHTML = null;
    const cleardata = {"products": []};
    const clearUser = {};
    localStorage.setItem("cart", JSON.stringify(cleardata));
    localStorage.setItem("user", JSON.stringify(clearUser));
    
}

