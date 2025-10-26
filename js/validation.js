export function validateLogin(login) {
    return login && login.length >= 3;
}

export function validatePassword(password) {
    return password && password.length >= 6;
}