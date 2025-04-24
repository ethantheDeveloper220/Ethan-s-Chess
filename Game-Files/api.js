async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    displayUserProfile(data.username, data.role, data.badges);
    displayUserDashboard(data.role);
  } else {
    alert(data.message);
  }
}

function displayUserProfile(username, role, badges) {
  document.getElementById('profile-username').textContent = username;
  document.getElementById('profile-role').textContent = role;

  if (role === 'owner') {
    document.getElementById('profile-role').textContent = "Owner";
  }

  document.getElementById('profile-badges').textContent = badges.join(", ");
  document.getElementById('user-profile').style.display = 'block';
}

function displayUserDashboard(role) {
  if (role === 'admin' || role === 'owner') {
    document.getElementById('admin-panel').style.display = 'block';
  }
}

async function viewAllUsers() {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/admin/users', {
    method: 'GET',
    headers: {
      'Authorization': token,
    },
  });

  const data = await response.json();
  if (response.ok) {
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
  } else {
    alert(data.message);
  }
}

async function deleteUser() {
  const username = prompt("Enter username to delete:");
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/admin/user/${username}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    },
  });

  const data = await response.json();
  if (response.ok) {
    alert(`User ${username} deleted.`);
    viewAllUsers(); // Refresh the user list
  } else {
    alert(data.message);
  }
}
