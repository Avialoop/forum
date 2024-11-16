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

// Отображение формы входа
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
    event.preventDefault();
    // Здесь можно добавить логику проверки логина и пароля
    currentUser = "Пользователь"; // Установите текущего пользователя; заменить на реальную логику
    alert("Вход выполнен!");
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

    const title = document.getElementById("post-title").value; // Получаем заголовок
    const content = document.getElementById("post-content").value; // Получаем содержание
    const image = document.getElementById("post-image").files[0]; // Получаем изображение
    const isAnonymous = document.getElementById("anonymous").checked; // Проверяем, отправлено ли анонимно
    const postAuthor = isAnonymous ? "Аноним" : currentUser; // Устанавливаем автора

    const post = {
        title: title,
        content: content,
        image: image ? URL.createObjectURL(image) : null, // Если изображение существует, создаем URL
        author: postAuthor
    };

    posts.push(post); // Добавляем пост в массив
    renderPosts(); // Обновляем отображение постов

    document.getElementById("post-form").reset(); // Сбрасываем форму
}

// Отображение постов
function renderPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title; // Заголовок поста
        postElement.appendChild(postTitle); // Добавляем заголовок в пост

        const postContent = document.createElement("p");
        postContent.textContent = post.content; // Содержание поста
        postElement.appendChild(postContent); // Добавляем содержание в пост

        if (post.image) {
            const imgElement = document.createElement("img");
            imgElement.src = post.image; // Изображение поста
            postElement.appendChild(imgElement); // Добавляем изображение в пост
        }

        const authorElement = document.createElement("p");
        authorElement.textContent = `Автор: ${post.author}`; // Автор поста
        postElement.appendChild(authorElement); // Добавляем автора в пост

        // Кнопка редактировать
        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать"; // Текст кнопки
        editButton.classList.add("edit-button");
        editButton.onclick = function() {
            editPost(index); // Вызов функции редактирования
        };
        postElement.appendChild(editButton); // Добавляем кнопку редактирования в пост

        // Кнопка удалить
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить"; // Текст кнопки
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = function() {
            deletePostByIndex(index); // Вызов функции удаления
        };
        postElement.appendChild(deleteButton); // Добавляем кнопку удаления в пост

        postsContainer.prepend(postElement); // Добавляем пост в начало контейнера
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

// Удаление поста через админ-панель
function deletePost() {
    const postId = document.getElementById("post-id").value; // Получаем ID поста
    const index = parseInt(postId, 10); // Преобразуем в число
    if (index >= 0 && index < posts.length) {
        posts.splice(index, 1); // Удаляем пост из массива
        renderPosts(); // Обновляем отображение
        alert("Пост удален."); // Уведомление об удалении
    } else {
        alert("Пост не найден."); // Уведомление о том, что пост не найден
    }
}

// Блокировка пользователя через админ-панель
function blockUser() {
    const userId = document.getElementById("user-id").value; // Получаем ID пользователя
    alert(`Пользователь с ID ${userId} заблокирован.`); // Уведомление о блокировке
    // Здесь можно добавить логику для блокировки пользователя
}

// Показать админ-панель
function showAdminPanel() {
    if (isAdmin) {
        alert("Вы уже вошли как администратор."); // Проверка, администратор ли пользователь
        return;
    }

    isAdmin = true; // Устанавливаем флаг администратора
    document.getElementById("post-container").classList.add("hidden"); // Скрываем контейнер с постами

    const adminPanel = document.createElement("div");
    adminPanel.classList.add("admin-panel");
    adminPanel.innerHTML = `
        <h2>Админ Панель</h2>
        <input type="text" id="post-id" placeholder="ID поста для удаления">
        <button onclick="deletePost()">Удалить пост</button>
        <input type="text" id="user-id" placeholder="ID пользователя для блокировки">
        <button onclick="blockUser()">Заблокировать пользователя</button>
    `;
    document.getElementById("app").appendChild(adminPanel); // Добавляем админ-панель в приложение
}

// Логика выхода из аккаунта
function logout() {
    currentUser = null; // Сбрасываем текущего пользователя
    alert("Вы вышли из системы."); // Уведомление о выходе
    showLogin(); // Показать форму входа
}
