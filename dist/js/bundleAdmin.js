/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./admin/Myadmin/modules/ShowData.js":
/*!*******************************************!*\
  !*** ./admin/Myadmin/modules/ShowData.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShowData: () => (/* binding */ ShowData)
/* harmony export */ });
/* harmony import */ var _Tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tabs */ "./admin/Myadmin/modules/Tabs.js");


function ShowData (products, categories){
    
    const container = document.getElementById('product-list-container');
    const categoryContainer = document.getElementById('category-container');

    container.innerHTML = null;
    // categoryContainer.innerHTML = null;

    
  
    products.forEach((el, index) => {

        const item = document.createElement('tr');
        item.innerHTML = `
            <td class="product-id">${el.id}</td>
            <td class="product-img">
                 <img style="width:70px" alt="${el.name}" src="../../${el.imageSrc}">
            </td>
            <td class="product-name">${el.name}</td>
            <td class="product-subname">${el.sub_name}</td>
            <td class="product-price">${el.price}</td>
            <td class="product-description">${el.description}</td>
            <td class="product-weight">${el.weight}</td>
            <td style="display: none;" class="product-category">${el.category_id}</td>
            <td  class="d-flex flex-column">
                <button class="btn btn-primary editBtn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-id="${el.id}">Изменить</button>
                ${el.is_available ? 
                    `<button class="btn btn-success HideBtn mt-2" data-id-available="${el.is_available}" data-id="${el.id}">Скрыть</button>` : 
                    `<button class="btn btn-secondary HideBtn mt-2" data-id-available="${el.is_available}" data-id="${el.id}">Показать</button>`               
                }
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

    (0,_Tabs__WEBPACK_IMPORTED_MODULE_0__.EditDelHideButtons)();

    
}


/***/ }),

/***/ "./admin/Myadmin/modules/Tabs.js":
/*!***************************************!*\
  !*** ./admin/Myadmin/modules/Tabs.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditDelHideButtons: () => (/* binding */ EditDelHideButtons),
/* harmony export */   clickTabs: () => (/* binding */ clickTabs)
/* harmony export */ });
/* harmony import */ var _ShowData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShowData */ "./admin/Myadmin/modules/ShowData.js");
/* harmony import */ var _requests__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./requests */ "./admin/Myadmin/modules/requests.js");




function clickTabs() {
    const tabs = document.querySelectorAll('#category-container a');
            tabs.forEach(item => {
                item.addEventListener('click', (e) => {
                    const idOfCategory = Number(e.target.getAttribute('data-id'));
                    
                    FilterProducts(idOfCategory);
                })
            })

    async function FilterProducts(id){
                try {
                    const productsProm = await (0,_requests__WEBPACK_IMPORTED_MODULE_1__.GetProducts)();
                    // const categories = JSON.parse(localStorage.getItem("categories"));
        
                    const filteredProducts = productsProm.filter(product => product.category_id === id);
        
                    (0,_ShowData__WEBPACK_IMPORTED_MODULE_0__.ShowData)(filteredProducts);
                }
                catch(e){
                    console.log('ебанная ошибка', e);
                    throw e;
                }
            }
}


function EditDelHideButtons(){
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
                category: element.querySelector('#editProductCategory').value
            }
        }
        return {
                name: element.querySelector('.product-name').innerText,
                subname: element.querySelector('.product-subname').innerText,
                description: element.querySelector('.product-description').innerText,
                imgSrc: element.querySelector('.product-img img').src,
                
                price: element.querySelector('.product-price').innerText,
                weight: element.querySelector('.product-weight').innerText,
                category: element.querySelector('.product-category').innerText
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



    //Обработка событий "click" по кнопке "Отправить изменения о товаре"

    ChangeForm.addEventListener('click', (e) => {
        e.preventDefault();
        const element = e.target.closest('form');
        const currentProductInfo = getDataFromInputs(element);
              delete currentProductInfo.imgSrc;
        const defaultProductInfo = JSON.parse(localStorage.getItem('savedProduct'));
        const formData = new FormData();

        if(formFile.files[0]){
            formData.append("image", formFile.files[0]);
        }
        for (const field in currentProductInfo) {
            if (currentProductInfo[field] !== defaultProductInfo[field]) {
                formData.append(field, currentProductInfo[field]);
            }
        }

        console.log(formData);

        
    })
}

/***/ }),

/***/ "./admin/Myadmin/modules/requests.js":
/*!*******************************************!*\
  !*** ./admin/Myadmin/modules/requests.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetAllData: () => (/* binding */ GetAllData),
/* harmony export */   GetProducts: () => (/* binding */ GetProducts),
/* harmony export */   getCategories: () => (/* binding */ getCategories)
/* harmony export */ });
/* harmony import */ var _ShowData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShowData */ "./admin/Myadmin/modules/ShowData.js");


async function GetProducts(){
    try {
       const res = await fetch('https://artichecker.com/BBQ-Smoker/api/getProducts');
       const data = await res.json();
        
        return data; 
    } catch(e){
        console.error('Ошибка при получении товаров:', e);
    }
    
}

async function getCategories(){
    try {
       const res = await fetch('https://artichecker.com/BBQ-Smoker/api/getCategories');
       const data = await res.json();
        
        return data; 
    } catch(e){
        console.error('Ошибка при получении категорий:', e);
    }
    
}

async function GetAllData(){
    try {
        const productsProm = await GetProducts();
        const categoriesProm = await getCategories();

        const [products, categories] = await Promise.all([productsProm, categoriesProm]);

        
        localStorage.setItem("categories", JSON.stringify(categories));
        

        (0,_ShowData__WEBPACK_IMPORTED_MODULE_0__.ShowData)(products, categories);
        
    } catch(e){
        console.log('Не удалось получить все данные', e);
        throw e;
    }
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./admin/Myadmin/scripts.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_requests__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/requests */ "./admin/Myadmin/modules/requests.js");
/* harmony import */ var _modules_Tabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Tabs */ "./admin/Myadmin/modules/Tabs.js");



window.addEventListener("DOMContentLoaded", (e) => {

   (0,_modules_requests__WEBPACK_IMPORTED_MODULE_0__.GetAllData)()
        .then(data => {
            
            (0,_modules_Tabs__WEBPACK_IMPORTED_MODULE_1__.clickTabs)();
            
        })

})
})();

/******/ })()
;
//# sourceMappingURL=bundleAdmin.js.map