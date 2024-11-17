let isAdmin = false; // Флаг для проверки, является ли пользователь администратором
let posts = JSON.parse(localStorage.getItem('posts')) || []; // Получаем посты из localStorage
let users = JSON.parse(localStorage.getItem('users')) || []; // Получаем пользователей из localStorage
let currentUser = null; // Текущий пользователь, который вошел в систему
let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || {}; // Получаем заблокированных пользователей

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        renderPosts(); // Отображаем посты при загрузке
    }, 2000);
    
    // Проверяем заблокирован ли текущий пользователь
    if (currentUser && bannedUsers[currentUser]) {
        alert(`Вы заблокированы администрацией.\nПричина: ${bannedUsers[currentUser].reason}\nОсталось времени до разблокировки: ${bannedUsers[currentUser].timeLeft} сек.`);
    }
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
        document.getElementById("admin-panel-button").classList.remove("hidden"); // Показываем кнопку панели администратора
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
    const action = prompt("Выберите действие:\n1. Удалить пост\n2. Заблокировать пост\n3. Продлить срок жизни поста\n4. Закрепить пост");
    switch (action) {
        case "1":
            deletePostByIndex(postIndex); // Удалить пост
            break;
        case "2":
            const reason = prompt("Введите причину блокировки:");
            blockPost(postIndex, reason); // Заблокировать пост
            break;
        case "3":
            extendPostLife(postIndex); // Продлить срок жизни поста
            break;
        case "4":
            pinPost(postIndex); // Закрепить пост
            break;
        default:
            alert("Некорректный выбор действия.");
    }
}

// Продлить срок жизни поста
function extendPostLife(postIndex) {
    const seconds = parseInt(prompt("На сколько секунд продлить срок жизни поста?"), 10);
    if (!isNaN(seconds) && seconds > 0) {
        posts[postIndex].createdAt += seconds * 1000; // Продление срока жизни
        localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем изменения в localStorage
        renderAdminPosts(); // Обновляем отображение постов в панели администратора
        alert(`Срок жизни поста продлен на ${seconds} секунд.`);
    } else {
        alert("Некорректное значение.");
    }
}

// Блокировка поста
function blockPost(index, reason) {
    posts[index].isBlocked = true; // Устанавливаем флаг блокировки
    posts[index].blockedReason = reason; // Устанавливаем причину блокировки
    posts[index].content = ""; // Очищаем содержимое поста
    localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
    renderPosts(); // Обновляем отображение постов на главной странице
    renderAdminPosts(); // Обновляем отображение постов в панели администратора
    alert("Пост заблокирован.");
}

// Создание поста
function createPost(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    const allowComments = document.getElementById("allow-comments").checked;

    // Проверяем, вошел ли пользователь и не заблокирован ли он
    if (!currentUser) {
        alert("Сначала войдите в систему, чтобы опубликовать пост.");
        return;
    }

    if (bannedUsers[currentUser]) {
        alert(`Вы заблокированы администрацией.\nПричина: ${bannedUsers[currentUser].reason}\nОсталось времени до разблокировки: ${bannedUsers[currentUser].timeLeft} сек.`);
        return;
    }

    const newPost = {
        title: title,
        content: content,
        author: currentUser,
        createdAt: Date.now() + 24 * 60 * 60 * 1000, // Устанавливаем время жизни поста на 24 часа
        allowComments: allowComments,
        isBlocked: false,
        isPinned: false,
        comments: [] // Инициализируем массив комментариев
    };

    posts.push(newPost); // Добавляем новый пост в массив
    localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем изменения в localStorage
    renderPosts(); // Обновляем отображение постов на главной странице

    // Очищаем поля ввода после публикации
    document.getElementById("post-title").value = "";
    document.getElementById("post-content").value = "";
    document.getElementById("allow-comments").checked = false;
}

// Логика выхода из аккаунта
function logout() {
    currentUser = null; // Сбрасываем текущего пользователя
    isAdmin = false; // Сбрасываем флаг администратора
    document.getElementById("admin-panel-button").classList.add("hidden"); // Скрываем кнопку панели администратора
    document.getElementById("admin-login-button").classList.remove("hidden"); // Показываем кнопку входа как администратор
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

    // Проверяем, существует ли пользователь
    if (!users.includes(currentUser)) {
        alert("Пользователь не найден. Пожалуйста, зарегистрируйтесь.");
        return;
    }

    alert("Вход выполнен!"); // Уведомление о входе
    document.getElementById("form-container").
    classList.add("hidden"); // Скрываем форму входа
    document.getElementById("admin-panel-button").classList.toggle("hidden", !isAdmin);
    updateAccountInfo(); // Обновляем информацию о текущем пользователе
    checkForPinnedPosts(); // Проверяем наличие закрепленных постов
}

// Регистрация нового пользователя
function showRegistration() {
    document.getElementById("form-container").innerHTML = `
        <h2>Регистрация</h2>
        <form id="registration-form" onsubmit="handleRegistration(event)">
            <input type="text" id="new-username" placeholder="Имя пользователя" required>
            <button type="submit">Зарегистрироваться</button>
            <p>Уже есть аккаунт? <a href="#" onclick="showLogin()">Войдите</a></p>
        </form>
    `;
    document.getElementById("form-container").classList.remove("hidden"); // Показываем форму регистрации
}

// Обработка логики регистрации
function handleRegistration(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    const newUsername = document.getElementById("new-username").value; // Получаем имя пользователя

    // Проверяем, существует ли пользователь
    if (users.includes(newUsername)) {
        alert("Пользователь с таким именем уже существует. Пожалуйста, выберите другое имя.");
        return;
    }

    users.push(newUsername); // Добавляем нового пользователя в массив
    localStorage.setItem('users', JSON.stringify(users)); // Сохраняем пользователей в localStorage
    alert("Регистрация прошла успешно! Теперь вы можете войти в систему."); // Уведомление об успешной регистрации
    showLogin(); // Показать форму входа
}

// Проверка на наличие закрепленных постов
function checkForPinnedPosts() {
    const pinnedPosts = posts.filter(post => post.isPinned);
    if (pinnedPosts.length > 0) {
        alert(`Есть закрепленные посты:\n${pinnedPosts.map(post => post.title).join('\n')}`);
    }
}

// Отображение постов на главной странице
function renderPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        
        if (post.isBlocked) {
            postElement.classList.add("blocked"); // Добавляем класс для заблокированных постов
            postElement.innerHTML = `
                <h3 style="background-color: red; color: white;"> ${post.title}  🚫</h3>
                <p style="color: red;">Этот пост заблокирован администрацией.</p>
                <p>Причина: ${post.blockedReason}</p>
            `;
        } else {
            if (post.isPinned) {
                postElement.classList.add("pinned"); // Добавляем класс для закрепленных постов
            }

            const timeLeft = Math.max(0, Math.floor((post.createdAt - Date.now()) / 1000)); // Оставшееся время в секундах
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p>Автор: ${post.author}</p>
                <p>Дата: ${new Date(post.createdAt).toLocaleString()}</p>
                <p>Осталось времени: <span id="timer-${posts.indexOf(post)}">${minutes} минут ${seconds} секунд</span></p>
                ${post.allowComments ? `
                    <button onclick="toggleComments(${posts.indexOf(post)})">Показать комментарии</button>
                    <div id="comments-${posts.indexOf(post)}" style="display:none;">
                        <input type="text" id="comment-input-${posts.indexOf(post)}" placeholder="Ваш комментарий">
                        <button onclick="addComment(${posts.indexOf(post)})">Добавить</button>
                        <div id="comment-list-${posts.indexOf(post)}"></div>
                    </div>` : ""}
            `;
        }

        postsContainer.appendChild(postElement); // Добавляем пост в контейнер
    });

    // Удаляем посты, которые истекли
    removeExpiredPosts();
    updateTimers(); // Обновляем таймеры на странице
}

// Обновление таймеров
function updateTimers() {
    posts.forEach((post, index) => {
        const timerElement = document.getElementById(`timer-${index}`);
        if (timerElement) {
            const timeLeft = Math.max(0, Math.floor((post.createdAt - Date.now()) / 1000)); // Оставшееся время в секундах
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.innerText = `${minutes} минут ${seconds} секунд`;
        }
    });
}

// Удаление истекших постов
function removeExpiredPosts() {
    const currentTime = Date.now();
    posts = posts.filter(post => post.createdAt > currentTime); // Оставляем только те посты, которые еще не истекли
    localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем сохранение в localStorage
}

// Включить/выключить комментарии
function toggleComments(postIndex) {
    const commentsDiv = document.getElementById(`comments-${postIndex}`);
    commentsDiv.style.display = commentsDiv.style.display === "none" ? "block" : "none"; // Переключаем видимость комментариев
}

// Добавить комментарий
function addComment(postIndex) {
    const commentInput = document.getElementById(`comment-input-${postIndex}`);
    const commentText = commentInput.value;

    if (commentText) {
        posts[postIndex].comments.push({ author: currentUser, text: commentText }); // Добавляем комментарий в массив
        localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем изменения в localStorage
        renderComments(postIndex); // Обновляем отображение комментариев
        commentInput.value = ""; // Очищаем поле ввода комментария
    } else {
        alert("Комментарий не может быть пустым.");
    }
}

// Отображение комментариев
function renderComments(postIndex) {
    const commentList = document.getElementById(`comment-list-${postIndex}`);
    commentList.innerHTML = ""; // Очищаем список комментариев

    posts[postIndex].comments.forEach(comment => {
        const commentElement = document.createElement("div");
        commentElement.innerHTML = `<strong>${comment.author}:</strong> ${comment.text}`;
        commentList.appendChild(commentElement); // Добавляем комментарий в список
    });
}

// Функция для экстренной перезагрузки серверов
function showEmergencyReboot() {
    console.log("Попытка экстренной перезагрузки серверов..."); // Отладочное сообщение
    const password = prompt("Введите пароль для экстренной перезагрузки серверов:");
    if (password === "0852-7533") {
        clearAllPosts(); // Если пароль правильный, удаляем все посты
    } else {
        alert("Неверный пароль!"); // Ошибка при неправильном пароле
    }
}

// Функция для удаления всех постов
function clearAllPosts() {
    if (confirm("Вы уверены, что хотите удалить все посты? Это действие необратимо.")) {
        posts = []; // Очищаем массив постов
        localStorage.setItem('posts', JSON.stringify(posts)); // Обновляем localStorage
        renderPosts(); // Обновляем отображение постов на главной странице
        alert("Все посты были успешно удалены."); // Уведомление об успешном удалении
    }
}

// Обновление информации о текущем пользователе
function updateAccountInfo() {
    console.log("Обновление информации о пользователе:", currentUser);
}

// Начальная инициализация приложения
function initializeApp() {
    if (localStorage.getItem('posts')) {
        posts = JSON.parse(localStorage.getItem('posts'));
    }
    if (localStorage.getItem('users')) {
        users = JSON.parse(localStorage.getItem('users'));
    }
    if (localStorage.getItem('bannedUsers')) {
        bannedUsers = JSON.parse(localStorage.getItem('bannedUsers'));
    }
}

// Вызов функции инициализации
initializeApp();
