import { ShowData } from "./ShowData";
import { GetProducts, getCategories } from "./requests";

const TOKEN = document.cookie.substr(4);


export function clickTabs() {
    const tabs = document.querySelectorAll('#category-container a');
            tabs.forEach(item => {
                item.addEventListener('click', (e) => {
                    const idOfCategory = Number(e.target.getAttribute('data-id'));
                    
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
          previewImage = document.getElementById('previewImage'),
          ChangeForm = document.getElementById('saveChangesBtn'),
          selectContainer = document.getElementById('editProductCategory'),     
          Categories = JSON.parse(localStorage.getItem('categories'));
          selectContainer.innerHTML = null;
    
          
    function FileChange (event) {
        const selectedFile = event.target.files[0];
        console.log(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function(e) {  
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            }
            reader.readAsDataURL(selectedFile);

        } else {
            previewImage.src = '#';
            previewImage.style.display = 'none';
            }
        }

    formFile.addEventListener('change', (e) => {FileChange(e)});

    
    

   //Отображение категорий в теге <select/>

    Categories.forEach(category => {
        const item = document.createElement('option');
        item.setAttribute('value', category.id);
        item.innerText = category.name;
        selectContainer.appendChild(item);   
    });

    function getDataFromInputs(element){
        if(element.tagName === 'FORM'){
            return  {
                name: element.querySelector('#editProductName').value,
                subname: element.querySelector('#editProductSubName').value,
                description: element.querySelector('#editProductDescription').value,
                imgSrc: element.querySelector('#previewImage').src,
                
                price: element.querySelector('#editProductPrice').value,
                weight: element.querySelector('#editProductWeight').value,
                category_id: element.querySelector('#editProductCategory').value
            }
        }
        return {
                id: element.querySelector('.product-id').innerText,
                name: element.querySelector('.product-name').innerText,
                subname: element.querySelector('.product-subname').innerText,
                description: element.querySelector('.product-description').innerText,
                imgSrc: element.querySelector('.product-img img').src,
                
                price: element.querySelector('.product-price').innerText,
                weight: element.querySelector('.product-weight').innerText,
                category_id: element.querySelector('.product-category').innerText
        }
    }

    //Обработка событий "click" по кнопке "Изменить товар"

    Edits.forEach(edit => 
        edit.addEventListener('click' , (e) => {
            const element = e.target.closest('tr');
            const clearObj = getDataFromInputs(element);
                  delete clearObj.imgSrc;
    localStorage.setItem("savedProduct", JSON.stringify(clearObj));

            const body = document.querySelector('.modal-body form'),
                  
                  modalName = body.querySelector('#editProductName'),
                  modalSubname = body.querySelector('#editProductSubName'),
                  modalDescription = body.querySelector('#editProductDescription'),
                  modalImg = body.querySelector('#previewImage'),
                  modalPrice = body.querySelector('#editProductPrice'),
                  modalWeight = body.querySelector('#editProductWeight'),
                  modalCategory = body.querySelector('#editProductCategory');

            
            const { name, subname, description, imgSrc, price, weight, category } = getDataFromInputs(element);

                  modalName.value = name;
                  modalSubname.value = subname;
                  modalDescription.value = description;
                  modalImg.src = imgSrc;
                  modalPrice.value = price;
                  modalWeight.value = weight;
                  modalCategory.value = category;
    
}));



//Обработка событий "click" по кнопке "Скрыть / показать товар"

Hide.forEach(btnHide => {
    btnHide.addEventListener('click', (e) => {
        e.target.innerText = '';
        const isAvailable = Number(e.target.getAttribute('data-id-available'));
        const productID = Number(e.target.getAttribute('data-id'));
        console.log(document.cookie.substr(4));
        if(isAvailable){
            fetch(`https://artichecker.com/BBQ-Smoker/api/toggleProductAvailability/${productID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + TOKEN
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
                    'Authorization': 'Bearer ' + TOKEN
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



    //Обработка событий "click" по кнопке "Отправить изменения о товаре"

    ChangeForm.addEventListener('click', (e) => {
        e.preventDefault();
        const element = e.target.closest('form');
        const currentProductInfo = getDataFromInputs(element);
              delete currentProductInfo.imgSrc;
        const defaultProductInfo = JSON.parse(localStorage.getItem('savedProduct'));
        const productID = defaultProductInfo.id;

        const formData = new FormData();
        

        if(formFile.files[0]){
            formData.append("image", formFile.files[0]);
        }
        
        for (const field in currentProductInfo) {
            if (currentProductInfo[field] !== defaultProductInfo[field]) {
                formData.append(field, currentProductInfo[field]);
            }
        }

        console.log(Array.from(formData.entries()));

        fetch(`https://artichecker.com/BBQ-Smoker/api/product/${productID}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + TOKEN
            },
            body: formData
            
        })
        .then(res => alert(res))
        .catch(e => alert(e));
        

        
    })
}