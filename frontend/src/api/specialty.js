// src/api/specialtyApi.js
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const specialtyApi = axios.create({
    baseURL: `${SERVER_URL}/api/specialties`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getSpecialties = async () => {
    try {
        const response = await specialtyApi.get('/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch specialties');
    }
};

export const getSpecialtyDetails = async (specialtyId) => {
    try {
        
        const response = await specialtyApi.get(`/${specialtyId}/details`);
        const data = response.data;
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || `Failed to fetch details for specialty ${specialtyId}`);
    }
};