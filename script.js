let isAdmin = false; // Флаг для проверки, является ли пользователь администратором
let posts = JSON.parse(localStorage.getItem('posts')) || []; // Получаем посты из localStorage
let currentUser = null; // Текущий пользователь, который вошел в систему

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        renderPosts();
        updatePostTimer();
    }, 2000);
});

// Открыть панель администратора
function openAdminPanel() {
    if (!isAdmin) {
        alert("Вы должны войти как администратор!");
        return;
    }
    renderAdminPosts(); // Отображаем посты в панели администратора
    document.getElementById("admin-panel").classList.remove("hidden"); // Показываем панель администратора
}

// Закрыть панель администратора
function closeAdminPanel() {
    document.getElementById("admin-panel").classList.add("hidden"); // Скрываем панель администратора
}

// Показать страницу входа администратора
function showAdminLogin() {
    const adminPin = prompt("Введите ПИН-код администратора:"); // Запрашиваем пин-код
    if (adminPin === "0852-7533") {
        isAdmin = true; // Устанавливаем флаг администратора
        alert("Добро пожаловать, администратор!");
        openAdminPanel(); // Открываем панель администратора сразу после входа
    } else {
        alert("Неверный ПИН-код!"); // Ошибка при неправильном ПИН-коде
    }
}

// Отображение постов в панели администратора
function renderAdminPosts() {
    const adminPostsContainer = document.getElementById("admin-posts");
    adminPostsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>Автор: ${post.author}</p>
            <button onclick="showAdminPostActions(${index})">Действия</button>
        `;

        adminPostsContainer.appendChild(postElement); // Добавляем пост в контейнер
    });
}

// Показать действия для поста
function showAdminPostActions(postIndex) {
    const actions = confirm("Выберите действие:\n\n1. Удалить пост\n2. Заблокировать пост\n3. Удалить все заблокированные посты");
    if (actions) {
        const action = prompt("Введите номер действия (1, 2 или 3):");
        if (action === "1") {
            deletePostByIndex(postIndex); // Удалить пост
        } else if (action === "2") {
            blockPost(postIndex); // Заблокировать пост
        } else if (action === "3") {
            deleteAllBlockedPosts(); // Удалить все заблокированные посты
        }
    }
}

// Удалить все заблокированные посты
function deleteAllBlockedPosts() {
    posts = posts.filter(post => !post.isBlocked); // Фильтруем заблокированные посты
    localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем изменения в localStorage
    renderAdminPosts(); // Обновляем отображение постов в панели администратора
}

// Удаление поста по индексу
function deletePostByIndex(index) {
    posts.splice(index, 1); // Удаляем пост из массива
    localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
    renderPosts(); // Обновляем отображение постов на главной странице
    renderAdminPosts(); // Обновляем отображение постов в панели администратора
}

// Блокировка поста
function blockPost(index) {
    posts[index].isBlocked = true; // Устанавливаем флаг блокировки
    localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
    renderPosts(); // Обновляем отображение постов на главной странице
    renderAdminPosts(); // Обновляем отображение постов в панели администратора
}

// Остальная логика (вход, регистрация и т.д.) остается без изменений...



// Остальная логика (вход, регистрация и т.д.) остается без изменений...

// Функция для обновления таймера
function updatePostTimer() {
    setInterval(() => {
        const currentTime = new Date().getTime();
        posts.forEach((post, index) => {
            const timeLeft = Math.max(0, post.createdAt + 7 * 24 * 60 * 60 * 1000 - currentTime);
            if (timeLeft === 0 && !post.isBlocked) {
                deletePostByIndex(index);
            }
        });
        renderPosts(); // Обновляем отображение постов
    }, 1000);
}

// Отображение постов
function renderPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        // Вычисляем оставшееся время до удаления
        const currentTime = new Date().getTime();
        const timeLeft = Math.max(0, post.createdAt + 7 * 24 * 60 * 60 * 1000 - currentTime);
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        // Добавляем заголовок поста
        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title; // Заголовок поста
        postElement.appendChild(postTitle); // Добавляем заголовок в пост

        // Показ времени до удаления
        const timeDisplay = document.createElement("span");
        timeDisplay.textContent = `Осталось: ${daysLeft}д ${hoursLeft}ч ${minutesLeft}м`;
        timeDisplay.classList.add("time-display");
        postElement.appendChild(timeDisplay); // Добавляем отображение времени

        postElement.onclick = function () {
            showPostDetails(index); // Показать детали поста при клике
        };

        // Проверяем, заблокирован ли пост
        if (post.isBlocked) {
            postElement.classList.add("blocked"); // Добавляем класс для блокированных постов
            postElement.innerHTML += `<p>Пост заблокирован.</p>`;
        } else {
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
            if (isAdmin) {
                const blockButton = document.createElement("button");
                blockButton.textContent = "Заблокировать"; // Текст кнопки блокировки
                blockButton.classList.add("block-button");
                blockButton.onclick = function () {
                    blockPost(index); // Вызов функции блокировки
                };
                postElement.appendChild(blockButton); // Добавляем кнопку блокировки

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Удалить"; // Текст кнопки удаления
                deleteButton.classList.add("delete-button");
                deleteButton.onclick = function () {
                    deletePostByIndex(index); // Вызов функции удаления
                };
                postElement.appendChild(deleteButton); // Добавляем кнопку удаления
            }

            // Добавление секции комментариев
            if (post.comments) {
                const commentSection = document.createElement("div");
                commentSection.classList.add("comment-section");

                const commentInput = document.createElement("input");
                commentInput.placeholder = "Ваш комментарий";
                commentInput.className = "comment-input";

                const commentButton = document.createElement("button");
                commentButton.textContent = "Добавить комментарий";
                commentButton.onclick = function () {
                    addComment(index, commentInput.value); // Вызов функции добавления комментария
                    commentInput.value = ""; // Сброс поля ввода
                };

                commentSection.appendChild(commentInput);
                commentSection.appendChild(commentButton);

                // Отображение комментариев
                post.comments.forEach(comment => {
                    const commentElement = document.createElement("div");
                    commentElement.classList.add("comment");
                    commentElement.textContent = comment;
                    commentSection.appendChild(commentElement);
                });

                postElement.appendChild(commentSection); // Добавляем секцию комментариев в пост
            }
        }

        postsContainer.appendChild(postElement); // Добавляем пост в контейнер
    });
}

// Функция для показа деталей поста
function showPostDetails(postIndex) {
    const post = posts[postIndex];
    const postDetailContainer = document.createElement("div");
    postDetailContainer.className = "post-detail";

    postDetailContainer.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p>Автор: ${post.author}</p>
        <p>Создано: ${new Date(post.createdAt).toLocaleString()}</p>
        <button onclick="closePostDetails()">Закрыть</button>
    `;

    document.body.appendChild(postDetailContainer); // Добавляем детали поста в тело
}

// Функция для закрытия деталей поста
function closePostDetails() {
    const postDetailContainer = document.querySelector(".post-detail");
    if (postDetailContainer) {
        document.body.removeChild(postDetailContainer); // Удаляем детали поста
    }
}

// Функция добавления комментария
function addComment(postIndex, comment) {
    if (comment.trim() !== "") {
        posts[postIndex].comments.push(comment); // Добавляем комментарий в пост
        localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем изменения в localStorage
        renderPosts(); // Обновляем отображение постов
    }
}

// Блокировка поста
function blockPost(index) {
    posts[index].isBlocked = true; // Устанавливаем флаг блокировки
    localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
    renderPosts(); // Обновляем отображение постов
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
        showAdminPanel(); // Показываем панель администратора
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

// Показать форму входа
function showLogin() {
    document.getElementById("form-container").innerHTML = `
        <h2>Вход</h2>
        <form id="login-form" onsubmit="handleLogin(event)">
            <input type="text" id="username" placeholder="Имя пользователя" required>
            <button type="submit">Войти</button>
            <p>Нет аккаунта? <a href="#" onclick="showRegistration()">Зарегистрируйтесь</a></p>
        </form>
    `;
    document.getElementById("form-container").classList.remove("hidden"); // Показываем форму
}

// Обработка логики входа
function handleLogin(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    currentUser = document.getElementById("username").value; // Устанавливаем текущего пользователя
    alert("Вход выполнен!"); // Уведомление о входе
    document.getElementById("form-container").classList.add("hidden"); // Скрываем форму входа
    showPostContainer(); // Показать контейнер с постами
    updateAccountInfo(); // Обновляем информацию о текущем пользователе
}

// Обработка логики регистрации
function showRegistration() {
    document.getElementById("form-container").innerHTML = `
        <h2>Регистрация</h2>
        <form id="registration-form" onsubmit="handleRegistration(event)">
            <input type="text" id="new-username" placeholder="Имя пользователя" required>
            <button type="submit">Зарегистрироваться</button>
        </form>
    `;
    document.getElementById("form-container").classList.remove("hidden"); // Показываем форму
}

// Обработка логики регистрации
function handleRegistration(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
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
}

// Загрузка постов из localStorage при загрузке страницы
window.onload = function() {
    const savedPosts = JSON.parse(localStorage.getItem('posts'));
    if (savedPosts) {
        posts = savedPosts; // Загружаем сохраненные посты
        renderPosts(); // Отображаем посты
    }
};
