let isAdmin = false; // Флаг для проверки, является ли пользователь администратором
let posts = JSON.parse(localStorage.getItem('posts')) || []; // Получаем посты из localStorage
let users = JSON.parse(localStorage.getItem('users')) || []; // Получаем пользователей из localStorage
let currentUser = null; // Текущий пользователь, который вошел в систему

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        renderPosts();
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
            blockPost(postIndex); // Заблокировать пост
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
    const days = parseInt(prompt("На сколько дней продлить срок жизни поста?"), 10);
    if (!isNaN(days) && days > 0) {
        posts[postIndex].createdAt += days * 24 * 60 * 60 * 1000; // Продление срока жизни
        localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем изменения в localStorage
        renderAdminPosts(); // Обновляем отображение постов в панели администратора
        alert(`Срок жизни поста продлен на ${days} дней.`);
    } else {
        alert("Некорректное значение.");
    }
}

// Закрепить пост
function pinPost(postIndex) {
    posts[postIndex].isPinned = true; // Устанавливаем флаг закрепления
    localStorage.setItem('posts', JSON.stringify(posts)); // Сохраняем изменения в localStorage
    renderAdminPosts(); // Обновляем отображение постов в панели администратора
    alert("Пост закреплен.");
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

// Создание поста
function createPost(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    const allowComments = document.getElementById("allow-comments").checked;

    // Проверяем, вошел ли пользователь
    if (!currentUser) {
        alert("Сначала войдите в систему, чтобы опубликовать пост.");
        return;
    }

    const newPost = {
        title: title,
        content: content,
        author: currentUser,
        createdAt: new Date().getTime(),
        allowComments: allowComments,
        isBlocked: false,
        isPinned: false
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
    alert("Вход выполнен!"); // Уведомление о входе
    document.getElementById("form-container").classList.add("hidden"); // Скрываем форму входа
    document.getElementById("admin-panel-button").classList.toggle("hidden", !isAdmin); // Показываем или скрываем кнопку панели администратора
    updateAccountInfo(); // Обновляем информацию о текущем пользователе
}

// Показать форму регистрации
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
    const newUsername = document.getElementById("new-username").value;

    // Проверяем, существует ли пользователь с таким именем
    if (users.some(user => user.username === newUsername)) {
        alert("Пользователь с таким именем уже существует!");
        return;
    }

    // Добавляем нового пользователя
    users.push({ username: newUsername, isBlocked: false });
    localStorage.setItem('users', JSON.stringify(users)); // Сохраняем изменения в localStorage
    alert("Регистрация успешна!"); // Уведомление о регистрации
    showLogin(); // Показать форму входа после регистрации
}

// Обновление информации о текущем пользователе
function updateAccountInfo() {
    const accountInfo = document.getElementById("account-info");
    accountInfo.textContent = `Вход: ${currentUser}`;
}

// Отображение постов на главной странице
function renderPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    posts.forEach(post => {
        if (!post.isBlocked) { // Не отображаем заблокированные посты
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p>Автор: ${post.author}</p>
                <p>${new Date(post.createdAt).toLocaleString()}</p>
                ${post.allowComments ? '<p>Комментарии разрешены</p>' : '<p>Комментарии запрещены</p>'}
            `;
            postsContainer.appendChild(postElement); // Добавляем пост в контейнер
        }
    });
}

// Загрузка пользователей из localStorage при загрузке страницы
window.onload = function() {
    const savedPosts = JSON.parse(localStorage.getItem('posts'));
    if (savedPosts) {
        posts = savedPosts; // Загружаем сохраненные посты
        renderPosts(); // Отображаем посты
    }
    const savedUsers = JSON.parse(localStorage.getItem('users'));
    if (savedUsers) {
        users = savedUsers; // Загружаем сохраненных пользователей
    }
// Функция для показа окна ввода пароля
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
};
