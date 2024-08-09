// frontend/js/user.js

async function fetchSharedFiles() {
    const userId = localStorage.getItem('userId'); // User ID'yi localStorage'dan al

    if (!userId) {
        alert('You must log in first.');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`/api/files/shared/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();

        const videoList = document.getElementById('videoList');
        videoList.innerHTML = '';

        if (data.files.length === 0) {
            videoList.innerHTML = '<p>No videos shared with you.</p>';
            return;
        }

        data.files.forEach((file) => {
            const videoContainer = document.createElement('div');
            videoContainer.classList.add('video-container');
            videoContainer.innerHTML = `
                <video width="600" controls>
                    <source src="/uploads/${file}" type="video/${file.split('.').pop()}">
                    Your browser does not support the video tag.
                </video>
                <br>
                <a href="/uploads/${file}" class="download-button" download>Download</a>
                <hr>
            `;
            videoList.appendChild(videoContainer);
        });
    } catch (err) {
        console.error('Error fetching shared files:', err);
    }
}

// Sayfa yüklendiğinde videoları getir
window.onload = fetchSharedFiles;
