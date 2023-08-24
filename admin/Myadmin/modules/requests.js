export async function GetProducts(){
    try {
       const res = await fetch('https://artichecker.com/BBQ-Smoker/api/getProducts');
       const data = await res.json();
        
        return data; 
    } catch(e){
        console.error('Ошибка при получении товаров:', e);
    }
    
}