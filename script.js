let isAdmin = false; // Флаг для проверки, является ли пользователь администратором
let posts = []; // Массив для хранения постов
let currentUser = null; // Текущий пользователь, который вошел в систему

document.addEventListener("DOMContentLoaded", () => {
    // Скрываем основной контент до загрузки
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden"); // Скрываем анимацию загрузки
        document.getElementById("app").classList.remove("hidden"); // Показываем приложение
    }, 2000); // Анимация загрузки на 2 секунды
});

// Показываем форму входа
function showLogin() {
    document.getElementById("form-container").innerHTML = `
        <h2>Вход</h2>
        <form onsubmit="handleLogin(event)">
            <input type="text" placeholder="Логин" required>
            <input type="password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
        </form>
    `;
    document.getElementById("form-container").classList.remove("hidden"); // Показываем форму входа
    document.getElementById("post-container").classList.add("hidden"); // Скрываем контейнер с постами
}

// Обработка логики входа
function handleLogin(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    currentUser = "Пользователь"; // Установите текущего пользователя; заменить на реальную логику
    alert("Вход выполнен!"); // Уведомление о входе
    document.getElementById("form-container").classList.add("hidden"); // Скрываем форму входа
    showPostContainer(); // Показать контейнер с постами
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
        author: currentUser // Автор поста
    };

    posts.push(post); // Добавляем пост в массив
    renderPosts(); // Обновляем отображение постов

    document.getElementById("post-form").reset(); // Сброс формы
}

// Отображение постов
function renderPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    // Фильтруем посты, которые старше 7 дней
    posts = posts.filter(post => {
        const currentTime = new Date().getTime(); // Текущее время
        return currentTime - post.createdAt <= 7 * 24 * 60 * 60 * 1000; // Сохраняем только посты, которым не больше 7 дней
    });

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

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

        // Добавляем кнопки редактирования и удаления
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

        postsContainer.appendChild(postElement); // Добавляем пост в контейнер
    });
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
    renderPosts(); // Обновляем отображение постов
}

// Показать админ-панель
function showAdminPanel() {
    if (isAdmin) {
        alert("Вы уже вошли как администратор."); // Проверка, администратор ли пользователь
        return;
    }

    isAdmin = true; // Устанавливаем флаг администратора
    const adminPanel = document.createElement("div");
    adminPanel.classList.add("admin-panel");
    adminPanel.innerHTML = `
        <h2>Админ Панель</h2>
        <input type="text" id="post-id" placeholder="ID поста для удаления">
        <button onclick="deletePost()">Удалить пост</button>
    `;
    document.getElementById("app").appendChild(adminPanel); // Добавляем админ-панель в приложение
}

// Удаление поста через админ-панель
function deletePost() {
    const postId = parseInt(document.getElementById("post-id").value, 10); // Получаем ID поста
    if (postId >= 0 && postId < posts.length) {
        posts.splice(postId, 1); // Удаляем пост из массива
        renderPosts(); // Обновляем отображение
        alert("Пост удален."); // Уведомление об удалении
    } else {
        alert("Пост не найден."); // Уведомление о том, что пост не найден
    }
}

// Логика выхода из аккаунта
function logout() {
    currentUser = null; // Сбрасываем текущего пользователя
    alert("Вы вышли из системы."); // Уведомление о выходе
    showLogin(); // Показать форму входа
}
