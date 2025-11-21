interface User {
    id: number;
    name: string;
    email: string;
    website: string;
}

const header = document.getElementById('main-header') as HTMLElement;
const modal = document.getElementById('my-modal') as HTMLElement;
const modalBtn = document.getElementById('modal-btn') as HTMLButtonElement;
const closeBtn = document.querySelector('.close-btn') as HTMLElement;
const userContainer = document.getElementById('user-container') as HTMLElement;

window.addEventListener('scroll', (): void => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// слухач подій для відкриття та закриття модалки
modalBtn.addEventListener('click', (): void => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', (): void => {
    modal.style.display = 'none';
});

// Закриття модалки при кліку за межами вікна
window.addEventListener('click', (event: MouseEvent): void => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// фетч даних користувачів
async function fetchUsers(): Promise<void> {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users: User[] = await response.json(); // Використовуємо інтерфейс User[]
        renderUsers(users);
    } catch (error) {
        console.error('Помилка завантаження:', error);
        userContainer.innerHTML = '<p>Не вдалося завантажити дані.</p>';
    }
}

// Функція відображення
function renderUsers(users: User[]): void {
    userContainer.innerHTML = ''; // Очистка контейнера
    
    users.slice(0, 6).forEach((user) => { // Беремо перших 6
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