// src/stores/userStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        loading: true,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        role: (state) => state.user?.role || null,
    },
    actions: {
        async fetchSession() {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/check-session', { withCredentials: true });
                this.user = res.data; // Store user session data
            } catch (err) {
                this.user = null; // If no session or error, set user to null
            } finally {
                this.loading = false; // Set loading to false after checking session
            }
        },
        logout() {
            this.user = null; // Clear user data on logout
            this.loading = false; // Clear loading state
        },
    }
});
