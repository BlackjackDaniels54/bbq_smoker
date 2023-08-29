import { EditDelButtons } from "./Tabs";

export function ShowData (products, categories){
    
    const container = document.getElementById('product-list-container');
    const categoryContainer = document.getElementById('category-container');

    container.innerHTML = null;
    // categoryContainer.innerHTML = null;


  
    products.forEach((el, index) => {
        const item = document.createElement('tr');
        item.innerHTML = `
            <td class="product-id">${el.id}</td>
            <td class="product-img">
                 <img style="width:70px" src="../../${el.imageSrc}">
            </td>
            <td class="product-name">${el.name}</td>
            <td class="product-subname">${el.sub_name}</td>
            <td class="product-price">${el.price}</td>
            <td class="product-description">${el.description}</td>
            <td class="product-weight">${el.weight}</td>
            <td style="display: none;" class="product-category">${el.category_id}</td>
            <td class="d-flex flex-column">
                <button class="btn btn-info editBtn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-id="${el.id}">Изменить</button>
                <button class="btn btn-secondary deleteBtn mt-2" data-bs-toggle="modal" data-bs-target="#deactivateProductModal" data-id="${el.id}">Скрыть</button>
                <button class="btn btn-danger deleteBtn mt-2" data-bs-toggle="modal" data-bs-target="#deleteProductModal" data-id="${el.id}">Удалить</button>
            </td>
        `;

        container.appendChild(item);
    });

    if(categories) {
        categories.forEach(category => {
        const item = document.createElement('a');
        item.classList.add('list-group-item', 'list-group-item-action');
        item.setAttribute('data-bs-toggle', 'tab');
        item.setAttribute('data-id', category.id);
        item.innerHTML = category.name;
        
        
        categoryContainer.appendChild(item);
    })
    }

    EditDelButtons();

    
}
