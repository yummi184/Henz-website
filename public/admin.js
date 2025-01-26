// Admin login check
document.getElementById("login-form")?.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Login successful") {
        window.location.href = "control.html";
      } else {
        alert("Invalid credentials");
      }
    });
});

// Handle content update for selected page
document.getElementById("update-form")?.addEventListener("submit", function (event) {
  event.preventDefault();

  const page = document.getElementById("page-select").value;
  const courseName = document.getElementById("course-name").value;
  const courseDesc = document.getElementById("course-desc").value;
  const courseImage = document.getElementById("course-image").files[0];
  const downloadLink = document.getElementById("download-link").value;

  const formData = new FormData();
  formData.append("page", page);
  formData.append("name", courseName);
  formData.append("description", courseDesc);
  formData.append("image", courseImage);
  formData.append("link", downloadLink);

  fetch("/api/content", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      window.location.reload();
    });
});

// Load existing content
function loadContent(page) {
  fetch(`/api/content/${page}`)
    .then((res) => res.json())
    .then((data) => {
      const contentContainer = document.getElementById("existing-content");
      contentContainer.innerHTML = "";

      data.forEach((item, index) => {
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content-item");

        contentDiv.innerHTML = `
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <img src="${item.image}" alt="Course Image" style="width: 100px; height: 100px;">
          <a href="${item.link}" target="_blank">Download Link</a>
          <button onclick="deleteContent('${page}', ${index})">Delete</button>
          <br><br>
        `;

        contentContainer.appendChild(contentDiv);
      });
    });
}

// Delete content
function deleteContent(page, index) {
  fetch(`/api/content/${page}/${index}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      loadContent(page);
    });
          }
