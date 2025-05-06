// src/utils/auth.js

const TOKEN_KEY = "adminToken";

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function isLoggedIn() {

    const token = getToken();

    if (!token) {
        return false;
    }

    try {

        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return false;
        }
        const data = await response.json();

        return data.valid;

    } catch (error) {
        return false;
    }
}
