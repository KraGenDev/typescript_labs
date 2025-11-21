"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const header = document.getElementById('main-header');
const modal = document.getElementById('my-modal');
const modalBtn = document.getElementById('modal-btn');
const closeBtn = document.querySelector('.close-btn');
const userContainer = document.getElementById('user-container');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }
    else {
        header.classList.remove('scrolled');
    }
});
// слухач подій для відкриття та закриття модалки
modalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
// Закриття модалки при кліку за межами вікна
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// фетч даних користувачів
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://jsonplaceholder.typicode.com/users');
            const users = yield response.json(); // Використовуємо інтерфейс User[]
            renderUsers(users);
        }
        catch (error) {
            console.error('Помилка завантаження:', error);
            userContainer.innerHTML = '<p>Не вдалося завантажити дані.</p>';
        }
    });
}
// Функція відображення
function renderUsers(users) {
    userContainer.innerHTML = ''; // Очистка контейнера
    users.slice(0, 6).forEach((user) => {
        const card = document.createElement('div');
        card.classList.add('user-card');
        // Template String
        card.innerHTML = `
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <small>${user.website}</small>
        `;
        userContainer.appendChild(card);
    });
}
// Запуск фетч при завантаженні сторінки
fetchUsers();
