$(document).ready(function() {
    tinymce.init({
        selector: '#editProductSubName',
        // ... другие параметры
    });
    

    $('.list-group-item').click(function() {
        // Удаление класса 'active' у всех элементов списка
        $('.list-group-item').removeClass('active');
        // Добавление класса 'active' к выбранному элементу списка
        $(this).addClass('active');
        
    });

    // Переключение между вкладками
    $('#mainTab').click(function() {
        $('#mainContent').show();
        $('#addProductContent').hide();
        $('#productListContent').hide();
    });

    $('#addProductTab').click(function() {
        $('#mainContent').hide();
        $('#addProductContent').show();
        $('#productListContent').hide();
    });

    $('#productListTab').click(function() {
        $('#mainContent').hide();
        $('#addProductContent').hide();
        $('#productListContent').show();
        fetchProducts();
        fetchCategories();
    });

    /*
    async function fetchCategories() {
        const response = await axios.get('https://artichecker.com/BBQ-Smoker/api/getCategories');
        const categories = response.data;
    
        const categorySelect = $('#editProductCategory');
        categorySelect.empty();
    
        categories.forEach((category) => {
            categorySelect.append(new Option(category.name, category.id));
        });
    }
    */
    
    async function fetchProducts() {
        const response = await axios.get('https://artichecker.com/BBQ-Smoker/api/getProducts');
        const data = response.data;
    
        const tableBody = $('#productTable tbody');
        tableBody.empty();
    
        data.forEach((product) => {
            tableBody.append(`
                <tr>
                    <th scope="row">${product.id}</th>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td><img src="../${product.imageSrc}" width="50px" height="50px"></td>
                    <td>${product.price} грн.</td>
                    <td data-category-id="${product.category_id}">${product.category_id}</td>
                    <td>
                        <button class="btn btn-primary editBtn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-id="${product.id}">Изменить товар</button>
                        <button class="btn btn-danger deleteBtn ml-2" data-bs-toggle="modal" data-bs-target="#deleteProductModal" data-id="${product.id}">Удалить товар</button>
                    </td>
                </tr>
            `);

        });
    }


    // Получение списка товаров
    /*
    async function fetchProducts() {
        const response = await axios.get('https://artichecker.com/BBQ-Smoker/api/getProducts');
        const data = response.data;
    
        const categoryRequests = data.map(product => axios.get(`https://artichecker.com/BBQ-Smoker/api/getCategoryByProductId/${product.id}`));
        const categoryResponses = await Promise.all(categoryRequests);
    
        // Create a map from category ID to category name
        const categoryNames = {};
        const categoryIDs = {};
        categoryResponses.forEach((response, index) => {
            categoryIDs[data[index].id] = response.data.id;
            categoryNames[data[index].id] = response.data.name;
        });
    
        const tableBody = $('#productTable tbody');
        tableBody.empty();
    
        data.forEach((product) => {
            const categoryID = categoryIDs[product.id];
            const categoryName = categoryNames[product.id];
    
            tableBody.append(`
                <tr>
                    <th scope="row">${product.id}</th>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td><img src="..${product.imageSrc}" width="50px" height="50px"></td>
                    <td>${product.price} грн.</td>
                    <td data-category-id="${categoryID}">${categoryName}</td>
                    <td>
                        <button class="btn btn-primary editBtn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-id="${product.id}">Изменить товар</button>
                        <button class="btn btn-danger deleteBtn ml-2" data-bs-toggle="modal" data-bs-target="#deleteProductModal" data-id="${product.id}">Удалить товар</button>
                    </td>
                </tr>
            `);
        });
    }
    */
    
    // Обработка нажатий на кнопки изменения и удаления товара
    $(document).on('click', '.editBtn', function(){
        let row = $(this).closest('tr');  // ближайшая строка таблицы
        let id = $(this).data('id');
        let productName = row.children().eq(1).text();
        let productDescription = row.children().eq(2).text();
        let productImageSrc = row.children().eq(3).find('img').attr('src');
        productImageSrc = productImageSrc.replace('..', '');  // Удаление ".." из строки
        let productPrice = row.children().eq(4).text().replace(' грн.', '');
        let productCategory = row.children().eq(5).data('category-id');
        let productSubName = row.children().eq(6).text();
        $('#editProductSubName').val(productSubName);
        tinymce.get('editProductSubName').setContent(productSubName);
        $('#editProductName').val(productName);
        $('#editProductDescription').val(productDescription);
        $('#editProductImageSrc').val(productImageSrc);
        $('#editProductPrice').val(productPrice);
        $('#editProductCategory').val(productCategory);
        $('#saveChangesBtn').data('id', id);
    });

    $(document).on('click', '.deleteBtn', function(){
        let id = $(this).data('id');
        $('#confirmDeleteBtn').data('id', id);
    });

    // Ваш токен
    let token = "your_token";
    
    // Обработка отправки формы добавления товара
    $('#addProductContent form').submit(function(e){
        e.preventDefault();
        let productName = $('#productName').val();
        let productPrice = $('#productPrice').val();
        axios({
            method: 'post',
            url: '/BBQ-Smoker/api/product',
            headers: { 
                'Authorization': 'Bearer ' + token 
            },
            data: {
                name: productName,
                price: productPrice
            },
        }).then(function (response) {
            alert("Товар успешно добавлен");
            $('#productName').val("");
            $('#productPrice').val("");
            fetchProducts();
        }).catch(function (error) {
            console.log(error);
        });
    });
    
    // Обработка нажатий на кнопки в модальных окнах
    $('#saveChangesBtn').click(function(){
        let id = $(this).data('id');
        let newProductName = $('#editProductName').val();
        let newProductPrice = $('#editProductPrice').val();
        axios({
            method: 'put',
            url: '/BBQ-Smoker/api/product/' + id,
            headers: { 
                'Authorization': 'Bearer ' + token 
            },
            data: {
                name: newProductName,
                price: newProductPrice
            },
        }).then(function (response) {
            alert("Товар успешно обновлен");
            fetchProducts();
        }).catch(function (error) {
            console.log(error);
        });
    });
    
    $('#confirmDeleteBtn').click(function(){
        let id = $(this).data('id');
        axios({
            method: 'delete',
            url: '/BBQ-Smoker/api/product/' + id,
            headers: { 
                'Authorization': 'Bearer ' + token 
            },
        }).then(function (response) {
            alert("Товар успешно удален");
            fetchProducts();
        }).catch(function (error) {
            console.log(error);
        });
    });
});