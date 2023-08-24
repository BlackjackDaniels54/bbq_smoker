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
function ShowData (products){
    const container = document.getElementById('product-list-container');
    container.innerHTML = null;

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
            <td>
                <button class="btn btn-info editBtn" data-bs-toggle="modal" data-bs-target="#editProductModal" data-id="${el.id}">Изменить</button>
                <button class="btn btn-secondary deleteBtn mt-2" data-bs-toggle="modal" data-bs-target="#deactivateProductModal" data-id="${el.id}">Деактивировать</button>
                <button class="btn btn-danger deleteBtn mt-2" data-bs-toggle="modal" data-bs-target="#deleteProductModal" data-id="${el.id}">Удалить</button>
                
            </td>
        `;

        container.appendChild(item);
    });

}


/***/ }),

/***/ "./admin/Myadmin/modules/requests.js":
/*!*******************************************!*\
  !*** ./admin/Myadmin/modules/requests.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetProducts: () => (/* binding */ GetProducts)
/* harmony export */ });
async function GetProducts(){
    try {
       const res = await fetch('https://artichecker.com/BBQ-Smoker/api/getProducts');
       const data = await res.json();
        
        return data; 
    } catch(e){
        console.error('Ошибка при получении товаров:', e);
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
/* harmony import */ var _modules_ShowData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/ShowData */ "./admin/Myadmin/modules/ShowData.js");



window.addEventListener("DOMContentLoaded", (e) => {

    (0,_modules_requests__WEBPACK_IMPORTED_MODULE_0__.GetProducts)()
        .then(data =>{
            (0,_modules_ShowData__WEBPACK_IMPORTED_MODULE_1__.ShowData)(data);
            console.log(data);
        })

})
})();

/******/ })()
;
//# sourceMappingURL=bundleAdmin.js.map