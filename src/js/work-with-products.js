export async function interactWithProducts() {
  
      const toNum = (str) => parseFloat(str);

      const totalWeight = (amount, weight) => {
        const totalWeight = amount * toNum(weight);
        if(totalWeight >= 1000){
          return `${totalWeight / 1000} кг.`
        }else {
          return `${totalWeight} г.`
        }
      }


      function toCurrency(num) {
        const format = new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "UAH",  
          minimumFractionDigits: 0,
        }).format(num);
        return format;
      }

      // Корзина

      const cardAddArr = Array.from(document.querySelectorAll(".hvr-sweep-to-right"));
      const cartNum = document.querySelector(".count-of-items");
      const cart = document.querySelector(".basket-icon");


      class Cart {
        products;
        constructor() {
          this.products = [];
        }
        get count() {
          return this.products.length;
        }
        addProduct(product) {
          this.products.push(product);
        }
        removeProduct(index) {
          this.products.splice(index, 1);
        }
        PlusAmount(index) {
            console.log(this.products[index])
            this.products[index].quantity++;
            this.products[index].totalCount = toCurrency(this.products[index].quantity * toNum(this.products[index].product.price)); 
        }
        MinusAmount(index) {
          if (this.products[index].quantity > 1) {
            this.products[index].quantity--;
            this.products[index].totalCount = this.products[index].quantity * toNum(this.products[index].product.price) + ' грн'; 
        }
      }

        get cost() {
          const prices = this.products.map((product) => {
            return toNum(product.totalCount);
          });
          console.log(this.products);
          const sum = prices.reduce((acc, num) => {
            return acc + num;
          }, 0);
          return sum;
        }
        
        get costDiscount() {
          const prices = this.products.map((product) => {
            return toNum(product.priceDiscount);
          });
          const sum = prices.reduce((acc, num) => {
            return acc + num;
          }, 0);
          return sum;
        }
        get discount() {
          return this.cost - this.costDiscount;
        }
      }

      class Product {

        constructor(card) {
          this.product = {
              id : card.getAttribute("data-id-cart"),
              imageSrc: card.querySelector(".product-img-container img").src,
              name : card.querySelector(".product-title").innerText,
              price : `${toNum(card.querySelector(".product-price").innerText)}`,
              sub_name: card.querySelector(".product-subtitle") ? 
                        card.querySelector(".product-subtitle").innerText : null,
              description: card.querySelector(".product-description") ? 
                           card.querySelector(".product-description").innerText : null,
              weight: card.querySelector(".product-weight") ? 
                      card.querySelector(".product-weight").innerText : null,

            // card.querySelector(".product-subtitle") ? 
            //     this.subtitle = card.querySelector(".product-subtitle").innerText :
            //     this.subtitle = null

            // product-weight
            
            // this.totalCount = card.querySelector(".product-price").innerText;
            // card.querySelector(".product-weight") ? 
            //     this.weight = card.querySelector(".product-weight").innerText :
            //     this.weight = null
          },
          this.quantity = 1;
          this.totalCount = toCurrency(this.quantity * this.product.price);
        }
      }
       
      const myCart = new Cart();
      

      if (localStorage.getItem("cart") == null) {
          localStorage.setItem("cart", JSON.stringify(myCart));
      }
            
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      myCart.products = savedCart.products;
      
         

      myCart.products = cardAddArr.forEach((cardAdd) => {
        cardAdd.addEventListener("click", (e) => {
          e.preventDefault();
          const card = e.target.closest(".grid-item");
          const IdCart = Number(card.getAttribute('data-id-cart'));
          const product = new Product(card);
          

          const savedCart = JSON.parse(localStorage.getItem("cart"));
          myCart.products = savedCart.products; 
          
          console.log(myCart.products)
          let isTrue = myCart.products.some(function(obj) {
              return IdCart == obj.product.id;
          })
          if(!isTrue){
            myCart.addProduct(product);
          }
          localStorage.setItem("cart", JSON.stringify(myCart));

          if(myCart.count > 0){
            cartNum.textContent = myCart.count;
            cart.classList.add("active");
            cartNum.classList.add("active");
          }
        });
      });

      // Попап

      const popup = document.querySelector(".popup");
      const popupClose = document.querySelector("#popup_close");
      const body = document.body;
      const popupContainer = document.querySelector("#popup_container");
      const popupProductList = document.querySelector("#popup_product_list");
      const popupCost = document.querySelector("#popup_cost");
      

      cart.addEventListener("click", (e) => {
        popupContainer.classList.remove("down_to_popup");
        e.preventDefault();
        popup.classList.add("popup--open");
        popupContainer.classList.add("upp_to_popup");
        body.classList.add("lock");
        popupContainerFill();
      });

      function popupContainerFill() {
        
        popupProductList.innerHTML = null;
        const savedCart = JSON.parse(localStorage.getItem("cart"));
        
        myCart.products = savedCart.products;
        // console.log(myCart.products)
        const productsHTML = myCart.products.map((productObj, productIndex) => {
          const product = productObj.product;

          const productItem = document.createElement("div");
          productItem.classList.add("popup__product");

          const productWrap1 = document.createElement("div");
          productWrap1.classList.add("popup__product-wrap");
          productWrap1.classList.add("popup__product-wrap-left");
          
          const productWrap2 = document.createElement("div");
          productWrap2.classList.add("popup__product-wrap");

          const productWrap3 = document.createElement("div");
          productWrap3.classList.add("popup__product-wrap3");

          const productImage = document.createElement("img");
          productImage.classList.add("popup__product-image");
          productImage.setAttribute("src", product.imageSrc);

          const productRowWrap = document.createElement("div");
          productRowWrap.classList.add("productRowWrap");
          productRowWrap.innerHTML = `
            <div class="popup__product-title">${product.name}</div>
            <div class="popup__product-subTitle">${product.sub_name ? product.sub_name : ''} <span>${product.weight ? totalWeight(productObj.quantity, product.weight) : ''}</span></div>
          `;
          
          const changeAmount = document.createElement("div");
          changeAmount.classList.add("changeAmount_container");
          changeAmount.innerHTML = `
            <div class="plus">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                <path class="background_path" opacity="0.1" d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" fill="#323232"/>
                <path d="M9 12H15" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 9L12 15" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="#323232" stroke-width="2"/>
              </svg>
          
            </div>
              <span class="total_count">${productObj.quantity}</span>
            <div class="minus">
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
                <path class="background_path" opacity="0.1" d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" fill="#323232"/>
                <path d="M9 12H15" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="#323232" stroke-width="2"/>
              </svg>
          
            </div>
          `;

          const productPrice = document.createElement("div");
          productPrice.classList.add("popup__product-price");
          productPrice.innerHTML = productObj.totalCount;

          const productDelete = document.createElement("button");
          productDelete.classList.add("popup__product-delete");
          productDelete.innerHTML = `
              <svg fill="#ff0000" width="40px" height="40px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path d="M589 307v-51H435v51H307v51h410v-51M333 410v358h358V410H333zm102 307h-51V461h51v256zm103 0h-52V461h52v256zm102 0h-51V461h51v256z"/>
              </svg>
          `;

          changeAmount.addEventListener("click", (e) => {
            
              if(e.target.closest(".plus")){
                  myCart.PlusAmount(productIndex);
                  localStorage.setItem("cart", JSON.stringify(myCart));
                  popupContainerFill();
              }else if(e.target.closest(".minus")){
                  myCart.MinusAmount(productIndex);
                  localStorage.setItem("cart", JSON.stringify(myCart));
                  popupContainerFill();
              } 
          })
          productDelete.addEventListener("click", (e) => {
            e.target.closest(".popup__product").classList.add("item-removed");
            setTimeout(function (){
                myCart.removeProduct(productIndex);
                localStorage.setItem("cart", JSON.stringify(myCart));
                popupContainerFill();
            }, 500);
            
          });


          productWrap1.appendChild(productImage);
          productWrap1.appendChild(productRowWrap);
          productWrap3.appendChild(changeAmount);
          productWrap3.appendChild(productPrice);
          productWrap2.appendChild(productWrap3);
          productWrap2.appendChild(productDelete);
          productItem.appendChild(productWrap1);
          productItem.appendChild(productWrap2);

          return productItem;
        });

        productsHTML.forEach((productHTML) => {
          popupProductList.appendChild(productHTML);
        });

        popupCost.value = toCurrency(myCart.cost);
        console.log(popupCost);
      }

      function closeModal() {
        popupContainer.classList.remove("upp_to_popup");
        popupContainer.classList.add("down_to_popup");
        
        setTimeout(function(){
          cartNum.textContent = myCart.count;
            if(myCart.count <= 0){
              cart.classList.remove("active");
              cartNum.classList.remove("active"); 
            }
            popup.classList.remove("popup--open");
            body.classList.remove("lock");
        }, 500)
      }

      window.addEventListener('click', (e) => {
        if(e.target.classList.contains('popup--open')){
          closeModal();
        }
      })

      popupClose.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
        
      });

    }



