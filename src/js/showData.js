import { getProductById, GetProducts } from "./request";



export async function fetchProductsWithCategory(index) {
  try {  
    const products = await GetProducts();

    const filterProducts = products.filter(product => product.category_id === index);
    
    showData(filterProducts)
  } catch (error) {
    console.error('Error while fetching products with category:', error);
  }
 }

export async function showData(products) {

  // Clear the container from previous products
  const container = document.getElementById('product-list');
  container.innerHTML = null;
  
  // Display each product
  products.forEach(product => {
    
      const item = document.createElement('div');
      item.classList.add('grid-item', 'col-12', 'col-sm-6', 'text-center', 'col-md-4', 'col-lg-3', 'gy-5');
      item.setAttribute('data-id-cart', product.id);
    
      let categoryElement = '';
      if(product.sub_name) {
          categoryElement = `<div class="product-subtitle">${product.sub_name}</div>`;
      }

      if(product.weight){
         item.innerHTML = `
            <div class="box-titles">  
                <div class="product-title">${product.name}</div>
                ${categoryElement}
            </div>
              <div class="product-weight-img-container product-img-container">
                  <img src="${product.imageSrc}" alt="">
                  <div class="lds-roller product-gif-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
              <div class="add-price-product-container mt-3 mt-lg-2">
                  
                    <div onmousedown="return false;" class="product-weight-price">
                        
                        <div class="product-weight"><span class="currency">${product.weight} г</span></div>
                        <div class="product-price">${product.weight ? (product.weight / 1000) * product.price : product.price} <span class="currency">грн</span> </div>
                    </div>
                    <div class="hvr-sweep-to-right" data-id-product="${product.id}">Замовити</div>
              </div>
              
          `;
      }else if(!product.weight) {
            item.innerHTML = `
            <div class="product-title">${product.name}</div>
            ${categoryElement}
            <div class="product-burger-img-container product-img-container">
                <img src="${product.imageSrc}" alt=""></img>
                <div class="lds-roller product-gif-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
            <div class="add-price-product-container mt-3 mt-lg-2">
                
                <div onmousedown="return false;" style="justify-content:center" class="product-weight-price">
                    
                    <div class="product-weight"><span class="currency"></span></div>
                    <div class="product-price">${product.weight ? (product.weight / 1000) * product.price : product.price} <span class="currency">грн</span></div>     
                </div>
                <div class="hvr-sweep-to-right" data-id-product="${product.id}">Замовити</div>      
            </div>
            <div class="product-description mt-2">${product.description ? product.description : ''}</div>
            
        `;
      }
         

      container.appendChild(item);
  });
    




  

    var images = document.querySelectorAll('.product-img-container img');

    images.forEach(img => {

      var spinner = img.parentNode.querySelector('.product-gif-loader');
      img.onload = function() {
          spinner.style.display = 'none';
      }
      img.src = img.src;
    })
}