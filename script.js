let isAdmin = false; // Флаг для проверки, является ли пользователь администратором
let posts = JSON.parse(localStorage.getItem('posts')) || []; // Получаем посты из localStorage
let currentUser = null; // Текущий пользователь, который вошел в систему
let timerInterval; // Переменная для таймера

document.addEventListener("DOMContentLoaded", () => {
    // Скрываем основной контент до загрузки
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden"); // Скрываем анимацию загрузки
        document.getElementById("app").classList.remove("hidden"); // Показываем приложение
        renderPosts(); // Отображаем посты при загрузке
        updatePostTimer(); // Запускаем таймер
    }, 2000); // Анимация загрузки на 2 секунды
});

// Функция для обновления таймера
function updatePostTimer() {
    timerInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        posts.forEach((post, index) => {
            const timeLeft = Math.max(0, post.createdAt + 7 * 24 * 60 * 60 * 1000 - currentTime); // 7 дней
            if (timeLeft === 0 && !post.isBlocked) {
                deletePostByIndex(index); // Удаляем пост по истечении времени
            }
        });
        updateTimerDisplay(); // Обновляем отображение таймера
    }, 1000); // Обновляем каждую секунду
}

// Функция для обновления отображения таймера
function updateTimerDisplay() {
    const currentTime = new Date().getTime();
    let totalTimeLeft = 0;

    posts.forEach(post => {
        const timeLeft = Math.max(0, post.createdAt + 7 * 24 * 60 * 60 * 1000 - currentTime);
        totalTimeLeft += timeLeft;
    });

    const daysLeft = Math.floor(totalTimeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((totalTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((totalTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    const timerDisplay = document.getElementById("post-timer");
    timerDisplay.textContent = `Осталось времени: ${daysLeft}д ${hoursLeft}ч ${minutesLeft}м`;
}

// Показать форму создания поста
function createPost(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const title = document.getElementById("post-title").value; // Получаем заголовок поста
    const content = document.getElementById("post-content").value; // Получаем содержание поста
    const allowComments = document.getElementById("allow-comments").checked; // Получаем флаг комментариев

    const post = {
        title: title,
        content: content,
        createdAt: new Date().getTime(), // Время создания поста
        author: currentUser, // Автор поста
        isBlocked: false, // Флаг блокировки поста
        comments: allowComments ? [] : null // Список комментариев, если разрешены
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

        // Проверяем, заблокирован ли пост
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
            if (isAdmin) {
                const blockButton = document.createElement("button");
                blockButton.textContent = "Заблокировать"; // Текст кнопки блокировки
                blockButton.classList.add("block-button");
                blockButton.onclick = function() {
                    blockPost(index); // Вызов функции блокировки
                };
                postElement.appendChild(blockButton); // Добавляем кнопку блокировки
            }

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

            // Добавление секции комментариев
            if (post.comments) {
                const commentSection = document.createElement("div");
                commentSection.classList.add("comment-section");

                const commentInput = document.createElement("input");
                commentInput.placeholder = "Ваш комментарий";
                commentInput.className = "comment-input";

                const commentButton = document.createElement("button");
                commentButton.textContent = "Добавить комментарий";
                commentButton.onclick = function() {
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

    // Здесь должна быть логика для проверки пользователя, временно добавим заглушку
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
