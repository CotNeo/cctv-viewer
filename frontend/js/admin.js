// frontend/js/admin.js

async function fetchFiles() {
  try {
      const response = await fetch('/api/files/all', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      const data = await response.json();

      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';

      data.files.forEach((file) => {
          const fileContainer = document.createElement('div');
          fileContainer.innerHTML = `
              <p><strong>Filename:</strong> ${file}</p>
              <button onclick="deleteFile('${file}')">Delete</button>
              <input type="text" id="shareWith-${file}" placeholder="Enter User IDs (comma separated)">
              <button onclick="shareFile('${file}')">Share</button>
              <hr>
          `;
          fileList.appendChild(fileContainer);
      });
  } catch (err) {
      console.error('Error fetching files:', err);
  }
}

// Upload a new video
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const videoFile = document.getElementById('video').files[0];
  const formData = new FormData();
  formData.append('video', videoFile);

  try {
      const response = await fetch('/api/files/upload', {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData,
      });
      const data = await response.json();
      document.getElementById('uploadStatus').innerText = data.message;

      // Fetch files again to update the list
      fetchFiles();
  } catch (err) {
      console.error('Error uploading file:', err);
  }
});

// Delete a video
async function deleteFile(filename) {
  try {
      const response = await fetch(`/api/files/delete/${filename}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          },
      });
      const data = await response.json();
      alert(data.message);

      // Fetch files again to update the list
      fetchFiles();
  } catch (err) {
      console.error('Error deleting file:', err);
  }
}

// Share a video with users
async function shareFile(filename) {
  const userIds = document.getElementById(`shareWith-${filename}`).value;
  const sharedWith = userIds.split(',').map((id) => id.trim());

  try {
      const response = await fetch('/api/files/share', {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ filename, sharedWith }),
      });
      const data = await response.json();
      alert(data.message);

      // Optionally fetch files again if you want to refresh the share status
      fetchFiles();
  } catch (err) {
      console.error('Error sharing file:', err);
  }
}

// Initial fetch of files
window.onload = fetchFiles;
