let isAdmin = false;

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

function createPost(event) {
    event.preventDefault();

    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    const image = document.getElementById("post-image").files[0];

    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const postTitle = document.createElement("h3");
    postTitle.textContent = title;
    postElement.appendChild(postTitle);

    const postContent = document.createElement("p");
    postContent.textContent = content;
    postElement.appendChild(postContent);

    if (image) {
        const imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(image);
        postElement.appendChild(imgElement);
    }

    // Добавляем кнопки редактирования и удаления
    const editButton = document.createElement("button");
    editButton.textContent = "Редактировать";
    editButton.classList.add("edit-button");
    editButton.onclick = function() {
        editPost(postElement);
    };
    postElement.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function() {
        postElement.remove();
    };
    postElement.appendChild(deleteButton);

    document.getElementById("posts").prepend(postElement);

    // Сброс формы
    document.getElementById("post-form").reset();
}

function editPost(postElement) {
    const title = postElement.querySelector("h3").textContent;
    const content = postElement.querySelector("p").textContent;

    document.getElementById("post-title").value = title;
    document.getElementById("post-content").value = content;

    // Удаляем пост, чтобы создать новый с обновленным содержанием
    postElement.remove();
}

function deletePost() {
    const postId = document.getElementById("post-id").value;
    const postElement = document.getElementById("posts").children[postId];
    if (postElement) {
        postElement.remove();
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
