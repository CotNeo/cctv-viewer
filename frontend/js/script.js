document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, password })
        });

        const data = await response.json();

        if (response.status === 200) {
            alert(data.message);
            
            if (userId.toLowerCase() === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
