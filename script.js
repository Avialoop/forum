let isAdmin = false;
let posts = [];

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
    }, 2000); // Анимация загрузки на 2 секунды
});

function showLogin() {
    document.getElementById("form-container").innerHTML = `
        <h2>Вход</h2>
        <form onsubmit="handleLogin(event)">
            <input type="text" placeholder="Логин" required>
            <input type="password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
        </form>
    `;
    document.getElementById("form-container").classList.remove("hidden");
    document.getElementById("post-container").classList.add("hidden");
}

function showRegister() {
    document.getElementById("form-container").innerHTML = `
        <h2>Регистрация</h2>
        <form onsubmit="handleRegister(event)">
            <input type="text" placeholder="Логин" required>
            <input type="password" placeholder="Пароль" required>
            <button type="submit">Зарегистрироваться</button>
        </form>
    `;
    document.getElementById("form-container").classList.remove("hidden");
    document.getElementById("post-container").classList.add("hidden");
}

function guestMode() {
    alert("Вы вошли как гость. Ваше имя: guest");
    showPostContainer();
}

function showPostContainer() {
    document.getElementById("form-container").classList.add("hidden");
    document.getElementById("post-container").classList.remove("hidden");
    renderPosts();
}

function showAdminPanel() {
    if (isAdmin) {
        alert("Вы уже вошли как администратор.");
        return;
    }

    isAdmin = true;
    document.getElementById("post-container").classList.add("hidden");

    const adminPanel = document.createElement("div");
    adminPanel.classList.add("admin-panel");
    adminPanel.innerHTML = `
        <h2>Админ Панель</h2>
        <input type="text" id="post-id" placeholder="ID поста для удаления">
        <button onclick="deletePost()">Удалить пост</button>
        <input type="text" id="user-id" placeholder="ID пользователя для блокировки">
        <button onclick="blockUser()">Заблокировать пользователя</button>
    `;
       document.getElementById("app").appendChild(adminPanel);
}

function handleLogin(event) {
    event.preventDefault();
    // Здесь вы можете добавить логику проверки логина и пароля
    alert("Вход выполнен!");
    showPostContainer();
}

function handleRegister(event) {
    event.preventDefault();
    // Здесь вы можете добавить логику регистрации пользователя
    alert("Регистрация успешна!");
    showPostContainer();
}

function createPost(event) {
    event.preventDefault();

    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    const image = document.getElementById("post-image").files[0];
    const postAuthor = "пользователь"; // Здесь можно добавить имя текущего пользователя

    const post = {
        title: title,
        content: content,
        image: image ? URL.createObjectURL(image) : null,
        author: postAuthor
    };

    posts.push(post); // Добавляем пост в массив
    renderPosts(); // Обновляем отображение постов

    // Сброс формы
    document.getElementById("post-form").reset();
}

function renderPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Очищаем контейнер перед добавлением новых постов

    posts.forEach((post, index) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title;
        postElement.appendChild(postTitle);

        const postContent = document.createElement("p");
        postContent.textContent = post.content;
        postElement.appendChild(postContent);

        if (post.image) {
            const imgElement = document.createElement("img");
            imgElement.src = post.image;
            postElement.appendChild(imgElement);
        }

        const authorElement = document.createElement("p");
        authorElement.textContent = `Автор: ${post.author}`;
        postElement.appendChild(authorElement);

        // Добавляем кнопки редактирования и удаления
        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать";
        editButton.classList.add("edit-button");
        editButton.onclick = function() {
            editPost(index);
        };
        postElement.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = function() {
            deletePostByIndex(index);
        };
        postElement.appendChild(deleteButton);

        postsContainer.prepend(postElement);
    });
}

function editPost(index) {
    const post = posts[index];
    document.getElementById("post-title").value = post.title;
    document.getElementById("post-content").value = post.content;

    // Удаляем пост, чтобы создать новый с обновленным содержанием
    deletePostByIndex(index);
}

function deletePostByIndex(index) {
    posts.splice(index, 1); // Удаляем пост из массива
    renderPosts(); // Обновляем отображение постов
}

function deletePost() {
    const postId = document.getElementById("post-id").value;
    const index = parseInt(postId, 10);
    if (index >= 0 && index < posts.length) {
        posts.splice(index, 1); // Удаляем пост из массива
        renderPosts(); // Обновляем отображение
        alert("Пост удален.");
    } else {
        alert("Пост не найден.");
    }
}

function blockUser() {
    const userId = document.getElementById("user-id").value;
    alert(`Пользователь с ID ${userId} заблокирован.`);
    // Здесь можно добавить логику для блокировки пользователя
}
