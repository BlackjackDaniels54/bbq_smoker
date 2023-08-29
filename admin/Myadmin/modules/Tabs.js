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


export function EditDelButtons(){
    const Edits = document.querySelectorAll('.editBtn');
    
    const selectContainer = document.getElementById('editProductCategory');
    selectContainer.innerHTML = null;

    const Categories = JSON.parse(localStorage.getItem('categories'));

    Categories.forEach(category => {
        const item = document.createElement('option');
        item.setAttribute('value', category.id);
        item.innerText = category.name;
        selectContainer.appendChild(item);   
    });





    Edits.forEach(btn => 
        btn.addEventListener('click' , (e) => {
            const element = e.target.closest('tr');
      
            const body = document.querySelector('.modal-body form'),
                  modalName = body.querySelector('#editProductName'),
                  modalSubname = body.querySelector('#editProductSubName'),
                  modalDescription = body.querySelector('#editProductDescription'),
                  modalPrice = body.querySelector('#editProductPrice'),
                  modalWeight = body.querySelector('#editProductWeight'),
                  modalCategory = body.querySelector('#editProductCategory');

                  modalName.placeholder = element.querySelector('.product-name').innerText;
                  modalSubname.placeholder = element.querySelector('.product-subname').innerText;
                  modalDescription.placeholder = element.querySelector('.product-price').innerText;
                  modalPrice.placeholder = element.querySelector('.product-price').innerText;
                  modalWeight.placeholder = element.querySelector('.product-weight').innerText;
                  modalCategory.placeholder = element.querySelector('.product-category').innerText;

            console.log(price);


            

    }));
}