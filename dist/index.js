"use strict";
// Пошук товару за ід
const findProduct = (products, id) => {
    if (!products.length) {
        console.warn('Попередження: Передано порожній список товарів.');
        return undefined;
    }
    return products.find((product) => product.id === id);
};
// Фільтрація товарів за максимальною ціною
const filterByPrice = (products, maxPrice) => {
    if (maxPrice < 0) {
        console.error('Помилка: Максимальна ціна не може бути від’ємною.');
        return [];
    }
    return products.filter((product) => product.price <= maxPrice);
};
/**
 * Додає товар у кошик
 * Якщо товар вже є, збільшує кількість. Якщо ні - додає новий запис
 * Повертає новий масив кошика
 */
const addToCart = (cart, product, quantity) => {
    if (quantity <= 0) {
        console.error('Помилка. Кількість товару має бути більше 0');
        return cart;
    }
    // Перевіряємо, чи є вже цей товар у кошику
    const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex] = Object.assign(Object.assign({}, updatedCart[existingItemIndex]), { quantity: updatedCart[existingItemIndex].quantity + quantity });
        return updatedCart;
    }
    else {
        return [...cart, { product, quantity }];
    }
};
// Підрахунок загальної суми в кошику
const calculateTotal = (cart) => {
    return cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
};
// тестові дані 
const electronicsList = [
    {
        id: 1,
        name: 'iPhone 15',
        price: 40000,
        description: 'Смартфон Apple',
        category: 'electronics',
        warrantyPeriod: 12,
        brand: 'Apple',
    },
    {
        id: 2,
        name: 'Samsung TV',
        price: 25000,
        description: 'Smart TV 4K',
        category: 'electronics',
        warrantyPeriod: 24,
        brand: 'Samsung',
    },
];
const clothingList = [
    {
        id: 101,
        name: 'Футболка біла',
        price: 500,
        description: 'Бавовняна футболка',
        category: 'clothing',
        size: 'M',
        material: 'Cotton',
    },
    {
        id: 102,
        name: 'Джинси',
        price: 1500,
        description: 'Класичні сині джинси',
        category: 'clothing',
        size: 'L',
        material: 'Denim',
    },
];
// Тестування пошуку
console.log('--- Пошук ---');
const foundPhone = findProduct(electronicsList, 1);
const foundShirt = findProduct(clothingList, 101);
if (foundPhone) {
    // Ми маємо доступ до поля brand, бо generic зберіг тип Electronics
    console.log(`Знайдено: ${foundPhone.name}, Бренд: ${foundPhone.brand}`);
}
// тестування фільтрації
console.log('\n--- Фільтрація (до 30000 грн) ---');
const affordableElectronics = filterByPrice(electronicsList, 30000);
affordableElectronics.forEach(p => console.log(`- ${p.name}: ${p.price} грн`));
// Тестування кошика
console.log('\n--- Робота з кошиком ---');
// Створюємо кошик для електроніки
let techCart = [];
if (foundPhone) {
    techCart = addToCart(techCart, foundPhone, 1); // +1 телефон
    techCart = addToCart(techCart, foundPhone, 2); // ще +2 телефони
}
// Спробуємо додати телевізор
const tv = findProduct(electronicsList, 2);
if (tv) {
    techCart = addToCart(techCart, tv, 1);
}
// Вивід вмісту кошика
console.log('Вміст кошика:');
techCart.forEach(item => {
    console.log(`${item.product.name} x ${item.quantity} = ${item.product.price * item.quantity} грн`);
});
// Підрахунок суми кошика
const total = calculateTotal(techCart);
console.log(`\nЗАГАЛЬНА СУМА: ${total} грн`);
