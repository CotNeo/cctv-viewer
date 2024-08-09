// frontend/js/login.js

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const userId = document.getElementById('userId').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, password })
      });

      const data = await response.json();

      if (response.status === 200) {
          alert(data.message);

          // Token, role ve userId'yi local storage'a kaydet
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('userId', userId); // User ID'yi sakla

          // Kullanıcıyı yönlendirme
          if (data.role === 'admin') {
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
