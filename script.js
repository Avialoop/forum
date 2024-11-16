let isAdmin = false; // Флаг для проверки, является ли пользователь администратором
let posts = JSON.parse(localStorage.getItem('posts')) || []; // Получаем посты из localStorage
let currentUser = null; // Текущий пользователь, который вошел в систему

document.addEventListener("DOMContentLoaded", () => {
    // Скрываем основной контент до загрузки
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden"); // Скрываем анимацию загрузки
        document.getElementById("app").classList.remove("hidden"); // Показываем приложение
        renderPosts(); // Отображаем посты при загрузке
    }, 2000); // Анимация загрузки на 2 секунды
});

// Показываем форму регистрации или входа
function showLogin() {
    document.getElementById("form-container").innerHTML = `
        <h2>Вход</h2>
        <form onsubmit="handleLogin(event)">
            <input type="text" placeholder="Логин" required>
            <input type="password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
        </form>
        <button onclick="showRegistration()">Нет аккаунта? Зарегистрироваться</button>
    `;
    document.getElementById("form-container").classList.remove("hidden"); // Показываем форму входа
    document.getElementById("post-container").classList.add("hidden"); // Скрываем контейнер с постами
}

// Показываем форму регистрации
function showRegistration() {
    document.getElementById("form-container").innerHTML = `
        <h2>Регистрация</h2>
        <form onsubmit="handleRegistration(event)">
            <input type="text" placeholder="Логин" required>
            <input type="password" placeholder="Пароль" required>
            <button type="submit">Зарегистрироваться</button>
        </form>
        <button onclick="showLogin()">Уже есть аккаунт? Войти</button>
    `;
}

// Обработка логики входа
function handleLogin(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    // Здесь должна быть логика для проверки пользователя, временно добавим заглушку
    currentUser = "Пользователь"; // Установите текущего пользователя; заменить на реальную логику
    alert("Вход выполнен!"); // Уведомление о входе
    document.getElementById("form-container").classList.add("hidden"); // Скрываем форму входа
    showPostContainer(); // Показать контейнер с постами
    updateAccountInfo(); // Обновляем информацию о текущем пользователе
}

// Обработка логики регистрации
function handleRegistration(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    // Здесь должна быть логика для регистрации пользователя
    alert("Регистрация успешна!"); // Уведомление о регистрации
    showLogin(); // Показать форму входа после регистрации
}

// Обновление информации о текущем пользователе
function updateAccountInfo() {
    const accountInfo = document.getElementById("account-info");
    accountInfo.textContent = `Вход: ${currentUser}`;
}

// Показать контейнер с постами
function showPostContainer() {
    document.getElementById("form-container").classList.add("hidden"); // Скрыть форму
    document.getElementById("post-container").classList.remove("hidden"); // Показать контейнер с постами
    renderPosts(); // Отобразить посты
}

// Создание поста
function createPost(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const title = document.getElementById("post-title").value; // Получаем заголовок поста
    const content = document.getElementById("post-content").value; // Получаем содержание поста

    const post = {
        title: title,
        content: content,
        createdAt: new Date().getTime(), // Время создания поста
        author: currentUser, // Автор поста
        isBlocked: false // Флаг блокировки поста
    };

    posts.push(post); // Добавляем пост в массив
    localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем посты в localStorage
    renderPosts(); // Обновляем отображение постов

    document.getElementById("post-form").reset(); // Сброс формы
}

// Отображение постов
function renderPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        if (post.isBlocked) {
            postElement.classList.add("blocked"); // Добавляем класс для блокированных постов
            postElement.innerHTML = `
                <h3>${post.title} <span>🚫</span></h3>
                <p>Пост заблокирован.</p>
            `;
        } else {
            const postTitle = document.createElement("h3");
            postTitle.textContent = post.title; // Заголовок поста
            postElement.appendChild(postTitle); // Добавляем заголовок в пост

            const postContent = document.createElement("p");
            postContent.textContent = post.content; // Содержание поста
            postElement.appendChild(postContent); // Добавляем содержание в пост

            const authorElement = document.createElement("p");
            authorElement.textContent = `Автор: ${post.author}`; // Автор поста
            postElement.appendChild(authorElement); // Добавляем автора в пост

            const postDate = new Date(post.createdAt); // Дата создания поста
            const dateElement = document.createElement("p");
            dateElement.textContent = `Создано: ${postDate.toLocaleString()}`; // Форматируем дату
            postElement.appendChild(dateElement); // Добавляем дату в пост

            // Добавляем кнопки редактирования, удаления и блокировки
            const blockButton = document.createElement("button");
            blockButton.textContent = "Заблокировать"; // Текст кнопки блокировки
            blockButton.classList.add("block-button");
            blockButton.onclick = function() {
                blockPost(index); // Вызов функции блокировки
            };
            postElement.appendChild(blockButton); // Добавляем кнопку блокировки

            const editButton = document.createElement("button");
            editButton.textContent = "Редактировать"; // Текст кнопки редактирования
            editButton.classList.add("edit-button");
            editButton.onclick = function() {
                editPost(index); // Вызов функции редактирования
            };
            postElement.appendChild(editButton); // Добавляем кнопку редактирования

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить"; // Текст кнопки удаления
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = function() {
                deletePostByIndex(index); // Вызов функции удаления
            };
            postElement.appendChild(deleteButton); // Добавляем кнопку удаления
        }

        postsContainer.appendChild(postElement); // Добавляем пост в контейнер
    });
}

// Блокировка поста
function blockPost(index) {
    posts[index].isBlocked = true; // Устанавливаем флаг блокировки
    localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
    renderPosts(); // Обновляем отображение постов
}

// Редактирование поста
function editPost(index) {
    const post = posts[index]; // Получаем пост по индексу
    document.getElementById("post-title").value = post.title; // Заполняем заголовок
    document.getElementById("post-content").value = post.content; // Заполняем содержание

    // Удаляем пост, чтобы создать новый с обновленным содержанием
    deletePostByIndex(index);
}

// Удаление поста по индексу
function deletePostByIndex(index) {
    posts.splice(index, 1); // Удаляем пост из массива
    localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
    renderPosts(); // Обновляем отображение постов
}

// Показать страницу входа администратора
function showAdminLogin() {
    const adminPin = prompt("Введите ПИН-код администратора:"); // Запрашиваем пин-код
    if (adminPin === "0852-7533") {
        isAdmin = true; // Устанавливаем флаг администратора
        alert("Добро пожаловать, администратор!");
        // Здесь можно перенаправить на страницу управления администратором
        // Например, показать панель управления
        showAdminPanel();
    } else {
        alert("Неверный ПИН-код!"); // Ошибка при неправильном ПИН-коде
    }
}

// Показать панель администратора
function showAdminPanel() {
    const adminPanel = document.createElement("div");
    adminPanel.classList.add("admin-panel");
    adminPanel.innerHTML = `
        <h2>Панель администратора</h2>
        <button onclick="clearPosts()">Очистить все посты</button>
        <button onclick="extendPostTime()">Продлить время постов</button>
    `;
    document.getElementById("app").appendChild(adminPanel); // Добавляем админ-панель в приложение
}

// Очистка всех постов
function clearPosts() {
    if (confirm("Вы уверены, что хотите удалить все посты?")) {
        posts = []; // Очищаем массив постов
        localStorage.removeItem('posts'); // Удаляем данные из localStorage
        renderPosts(); // Обновляем отображение
        alert("Все посты удалены."); // Уведомление об удалении
    }
}

// Продление времени постов
function extendPostTime() {
    const extendDays = parseInt(prompt("На сколько дней продлить время хранения постов?"), 10);
    if (extendDays > 0) {
        const currentTime = new Date().getTime();
        posts.forEach(post => {
            post.createdAt += extendDays * 24 * 60 * 60 * 1000; // Продляем время жизни постов
        });
        localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
        renderPosts(); // Обновляем отображение
        alert(`Время хранения постов продлено на ${extendDays} дней.`); // Уведомление о продлении
    }
}

// Логика выхода из аккаунта
function logout() {
    currentUser = null; // Сбрасываем текущего пользователя
    alert("Вы вышли из системы."); // Уведомление о выходе
    showLogin(); // Показать форму входа
}
