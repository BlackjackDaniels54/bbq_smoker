import { ShowData } from "./ShowData";

export async function GetProducts(){
    try {
       const res = await fetch('https://artichecker.com/BBQ-Smoker/api/getProducts');
       const data = await res.json();
        
        return data; 
    } catch(e){
        console.error('Ошибка при получении товаров:', e);
    }
    
}

export async function getCategories(){
    try {
       const res = await fetch('https://artichecker.com/BBQ-Smoker/api/getCategories');
       const data = await res.json();
        
        return data; 
    } catch(e){
        console.error('Ошибка при получении категорий:', e);
    }
    
}

export async function GetAllData(){
    try {
        const productsProm = await GetProducts();
        const categoriesProm = await getCategories();

        const [products, categories] = await Promise.all([productsProm, categoriesProm]);

        
        localStorage.setItem("categories", JSON.stringify(categories));
        

        ShowData(products, categories);
        
    } catch(e){
        console.log('Не удалось получить все данные', e);
        throw e;
    }
}

