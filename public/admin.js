// Handle form submission for updating course details
document.getElementById('update-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const page = document.getElementById('page-select').value;
  const courseName = document.getElementById('course-name').value;
  const courseDesc = document.getElementById('course-desc').value;
  const courseImage = document.getElementById('course-image').files[0];
  const downloadLink = document.getElementById('download-link').value;

  const formData = new FormData();
  formData.append('course-name', courseName);
  formData.append('course-desc', courseDesc);
  formData.append('course-image', courseImage);
  formData.append('download-link', downloadLink);
  formData.append('page', page);

  // Send data to the backend via fetch
  fetch('/update-course', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message); // Show success message
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to update course!');
  });
});

// Clear all data stored locally (if needed)
function clearAllData() {
  // Clears everything from localStorage
  localStorage.clear();
  alert('All data has been cleared!');
}

// Optionally, load existing content (to show in the "Existing Content" section)
function loadExistingContent() {
  fetch('/get-existing-content')
    .then(response => response.json())
    .then(data => {
      const existingContentDiv = document.getElementById('existing-content');
      existingContentDiv.innerHTML = ''; // Clear any existing content

      data.content.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('content-item');
        div.innerHTML = `
          <h3>${item.courseName}</h3>
          <p>${item.courseDesc}</p>
          <img src="/uploads/${item.courseImage}" alt="${item.courseName}">
          <a href="${item.downloadLink}" target="_blank">Download</a>
        `;
        existingContentDiv.appendChild(div);
      });
    })
    .catch(error => console.error('Error loading existing content:', error));
}

// Call loadExistingContent on page load to show existing content
window.onload = loadExistingContent;
