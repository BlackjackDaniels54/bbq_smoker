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

    (0,_Tabs__WEBPACK_IMPORTED_MODULE_0__.EditDelButtons)();

    
}


/***/ }),

/***/ "./admin/Myadmin/modules/Tabs.js":
/*!***************************************!*\
  !*** ./admin/Myadmin/modules/Tabs.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EditDelButtons: () => (/* binding */ EditDelButtons),
/* harmony export */   clickTabs: () => (/* binding */ clickTabs)
/* harmony export */ });
/* harmony import */ var _ShowData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShowData */ "./admin/Myadmin/modules/ShowData.js");
/* harmony import */ var _requests__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./requests */ "./admin/Myadmin/modules/requests.js");




function clickTabs() {
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


function EditDelButtons(){
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