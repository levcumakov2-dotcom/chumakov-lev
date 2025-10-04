import { users } from './mockDB.js';
import { validateLogin, validatePassword } from './validation.js';

export const auth = {
    checkAuth() {
        return localStorage.getItem('currentUser') !== null;
    },

    login(login, password) {
        if (!validateLogin(login) || !validatePassword(password)) {
            alert('Логин должен быть не менее 3 символов, пароль - не менее 6');
            return false;
        }

        const user = users.find(u => u.login === login && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    },

    register(login, password) {
        if (!validateLogin(login)) {
            alert('Логин должен быть не менее 3 символов');
            return false;
        }
        if (!validatePassword(password)) {
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
            name: login
        };

        users.push(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    },

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
};