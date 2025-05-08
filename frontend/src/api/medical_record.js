import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ficheApi = axios.create({
    baseURL: `${SERVER_URL}/api/medical-records`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getMedicalRecords = async () => {
    try {
        const response = await ficheApi.get('/');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch fiches');
    }
}

export const getMedicalRecord = async (id) => {
    try {
        const response = await ficheApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch fiche');
    }
};

export const createFiche = async (fiche) => {
    try {
        const response = await ficheApi.post('/', fiche);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create fiche');
    }
}

export const updateMedicalRecord = async (id, medicalRecord) => {
    try {
        const response = await ficheApi.patch(`/${id}`, medicalRecord);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update fiche');
    }
}