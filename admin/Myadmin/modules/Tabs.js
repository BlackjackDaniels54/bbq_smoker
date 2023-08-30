import axios from "axios";
import { ShowData } from "./ShowData";
import { GetProducts, getCategories } from "./requests";


export function clickTabs() {
    const tabs = document.querySelectorAll('#category-container a');
            tabs.forEach(item => {
                item.addEventListener('click', (e) => {
                    const idOfCategory = Number(e.target.getAttribute('data-id'));
                    console.log(idOfCategory)
                    FilterProducts(idOfCategory);
                })
            })

    async function FilterProducts(id){
                try {
                    const productsProm = await GetProducts();
                    // const categories = JSON.parse(localStorage.getItem("categories"));
        
                const filteredProducts = productsProm.filter(product => product.category_id === id);
        
                ShowData(filteredProducts);
                }
                catch(e){
                    console.log('ебанная ошибка', e);
                    throw e;
                }
            }
}


export function EditDelHideButtons(){
    const Edits = document.querySelectorAll('.editBtn'),
          Hide = document.querySelectorAll('.HideBtn'),
          formFile = document.getElementById('formFile'),
          previewImage = document.getElementById('previewImage');
          
          console.log(formFile.value);
          
          formFile.addEventListener('change', function(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    console.log(e.target.result);
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                
                reader.readAsDataURL(selectedFile);
                
            } else {
                previewImage.src = '#';
                previewImage.style.display = 'none';
            }
        });

    const selectContainer = document.getElementById('editProductCategory');
    selectContainer.innerHTML = null;

    const Categories = JSON.parse(localStorage.getItem('categories'));

    Categories.forEach(category => {
        const item = document.createElement('option');
        item.setAttribute('value', category.id);
        item.innerText = category.name;
        selectContainer.appendChild(item);   
    });


    Edits.forEach(edit => 
        edit.addEventListener('click' , (e) => {
            const element = e.target.closest('tr');
      
            const body = document.querySelector('.modal-body form'),
                  modalName = body.querySelector('#editProductName'),
                  modalSubname = body.querySelector('#editProductSubName'),
                  modalDescription = body.querySelector('#editProductDescription'),
                  modalImg = body.querySelector('#previewImage'),
                  modalPrice = body.querySelector('#editProductPrice'),
                  modalWeight = body.querySelector('#editProductWeight'),
                  modalCategory = body.querySelector('#editProductCategory');

                  modalName.value = element.querySelector('.product-name').innerText;
                  modalSubname.value = element.querySelector('.product-subname').innerText;
                  modalDescription.value = element.querySelector('.product-price').innerText;
                  modalImg.src = element.querySelector('.product-img img').src;
                  modalPrice.value = element.querySelector('.product-price').innerText;
                  modalWeight.value = element.querySelector('.product-weight').innerText;
                  modalCategory.value = element.querySelector('.product-category').innerText;


    }));


    Hide.forEach(btnHide => {
        btnHide.addEventListener('click', (e) => {
            e.target.innerText = '';
            const isAvailable = Number(e.target.getAttribute('data-id-available'));
            const productID = Number(e.target.getAttribute('data-id'));
  
            if(isAvailable){
                fetch(`https://artichecker.com/BBQ-Smoker/api/toggleProductAvailability/${productID}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer IloveCocks'
                    }
                })
                .then(function(data) {
                    e.target.setAttribute('data-id-available', '0');
                    e.target.classList.remove(...e.target.classList);
                    e.target.classList.add('btn', 'btn-secondary', 'HideBtn', 'mt-2');
                    e.target.innerText = 'Показать';
                    console.log(e.target);
                })
                .catch(function(error) {
                    alert('Ошибка при отправке запроса на сервер');
                });

            }else {
                fetch(`https://artichecker.com/BBQ-Smoker/api/toggleProductAvailability/${productID}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer IloveCocks'
                    }
                })
                .then(function(data) {
                    
                    e.target.setAttribute('data-id-available', '1');
                    e.target.classList.remove(...e.target.classList);
                    e.target.classList.add('btn', 'btn-success', 'HideBtn', 'mt-2');
                    e.target.innerText = 'Скрыть';
                    console.log(e.target);
                })
                .catch(function(error) {
                    alert('Ошибка при отправке запроса на сервер');
                });
            }

        })
    })
}