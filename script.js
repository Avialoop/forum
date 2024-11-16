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
