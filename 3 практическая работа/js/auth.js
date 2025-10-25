
async function loadUsers() {
    try {
        const localUsers = localStorage.getItem('admin_users');
        if (localUsers) {
            return JSON.parse(localUsers).users;
        }
        
        const response = await fetch('./server/data/users.json');
        const data = await response.json();
        
        localStorage.setItem('admin_users', JSON.stringify(data));
        return data.users;
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
        return [
            { id: 1, login: 'admin', password: '123456', name: 'Администратор', role: 'admin' },
            { id: 2, login: 'user', password: 'password', name: 'Пользователь', role: 'user' }
        ];
    }
}

async function saveUsers(users) {
    localStorage.setItem('admin_users', JSON.stringify({ users }));
}

export const auth = {
    async checkAuth() {
        return localStorage.getItem('currentUser') !== null;
    },

    async getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    async login(login, password) {
        const users = await loadUsers();
        const user = users.find(u => u.login === login && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    },

    async register(login, password, name = login) {
        const users = await loadUsers();
        
        if (!this.validateLogin(login)) {
            alert('Логин должен быть не менее 3 символов');
            return false;
        }
        if (!this.validatePassword(password)) {
            alert('Пароль должен быть не менее 6 символов');
            return false;
        }

        const existingUser = users.find(u => u.login === login);
        if (existingUser) {
            alert('Пользователь с таким логином уже существует');
            return false;
        }

        const newUser = {
            id: Date.now(),
            login: login,
            password: password,
            name: name,
            role: 'user'
        };

        users.push(newUser);
        await saveUsers(users);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    },

    validateLogin(login) {
        return login && login.length >= 3;
    },

    validatePassword(password) {
        return password && password.length >= 6;
    },

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    async isAdmin() {
        const user = await this.getCurrentUser();
        return user && user.role === 'admin';
    }
};