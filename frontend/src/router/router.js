import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import { useUserStore } from './../stors/user'; // Import the user store

import UserPage from '../pages/Users/UsersList.vue';
import ReceptionPage from '../pages/Reception/ReceptionPage.vue';
import LoginPage from '../pages/Auth/LoginPage.vue';
import ReceptionDashboardLayout from '../layout/ReceptionDashboardLayout.vue';
import PatientsList from '../pages/Reception/Patient/PatientsList.vue';
import PatientDetails from '../pages/Reception/Patient/PatientDetails.vue';
import UsersLayout from '../layout/UsersLayout.vue';
import UsersRoles from '../pages/Users/UsersRoles.vue';
import UsersHome from '../pages/Users/UsersHome.vue';
import AdminHomePage from '../pages/Admin/AdminHomePage.vue';
import MedicalRecordDetails from '../pages/Reception/MedicalRecord/MedicalRecordDetails.vue';
import MedicalRecordList from '../pages/Reception/MedicalRecord/MedicalRecordsList.vue';
import PreferencesDashboardLayout from '../layout/PreferencesDashboardLayout.vue';
import SpecialtiesList from '../pages/Specialties/SpecialtiesList.vue';
import PrestationsPage from '../pages/Prestation/PrestationsPage.vue';
import DoctorsPage from '../pages/Doctors/DoctorsPage.vue';
import CashierPage from '../pages/Cashier/CashierPage.vue';
import CashierPrestationsList from '../pages/Cashier/CashierPrestationsList.vue';
import CashierLayout from '../layout/CashierLayout.vue';

// Base Public Routes
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        beforeEnter: async (to, from, next) => {
            const userStore = useUserStore();
            await userStore.fetchSession(); // Fetch the session when trying to access login
            if (userStore.isAuthenticated) next('/'); // If already logged in, redirect to home
            else next(); // Otherwise, allow login page
        }
    },
];

// Admin Routes
const adminRoutes = [
    { path: '/', component: AdminHomePage },
    {
        path: '/users',
        component: UsersLayout,
        children: [
            { path: '', name: 'Users', component: UsersHome },
            { path: 'list', name: 'UsersList', component: UserPage },
            { path: 'roles', name: 'UsersRoles', component: UsersRoles },
        ]
    },
    {
        path: '/reception',
        component: ReceptionDashboardLayout,
        children: [
            { path: '', component: ReceptionPage },
            { path: 'patients', name: 'Patients', component: PatientsList },
            { path: 'patients/:id', name: 'PatientDetails', component: PatientDetails },
            { path: 'medical-records', name: 'MedicalRecords', component: MedicalRecordList },
            { path: 'medical-records/:id', name: 'MedicalRecord', component: MedicalRecordDetails },
        ]
    },
    ,
    {
        path: '/preferences',
        component: PreferencesDashboardLayout,
        children: [
            { path: 'specialties', component: SpecialtiesList },
            { path: 'prestations', component: PrestationsPage },
            { path: 'doctors', component: DoctorsPage },

        ]
    },
    {
        path: '/cashier',
        component: CashierLayout,
        children: [
            { path: '', component: CashierPage },
            { path: 'fiches/:ficheId/prestations', component: CashierPrestationsList }
        ]
    }
];

// Reception Routes
const receptionistRoutes = {
    path: '/',
    component: ReceptionDashboardLayout,
    children: [
        { path: '', component: ReceptionPage },
        { path: 'patients', component: PatientsList },
        { path: 'patients/:id', component: PatientDetails },
        { path: 'medical-records', component: MedicalRecordList },
        { path: 'medical-records/:id', component: MedicalRecordDetails },
    ],
};

// cashier routes
const cashierRoutes = {
    path: '/',
    component: CashierLayout,
    children: [
        { path: '', component: CashierPage },
        { path: 'fiches/:ficheId/prestations', component: CashierPrestationsList }
    ]
};


// Create router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Track if dynamic routes have been added
let routesAdded = false;

// Global route guard
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    await userStore.fetchSession(); // Ensure session is fetched

    // Allow login page without checking session
    if (to.path === '/login') return next();

    if (userStore.isAuthenticated) {
        if (!routesAdded) {
            if (userStore.role === 'Admin') {
                adminRoutes.forEach(route => router.addRoute(route)); // Add admin routes dynamically
            } else if (userStore.role === 'Reception') {
                router.addRoute(receptionistRoutes); // Add receptionist routes dynamically
            } else if (userStore.role === 'Cashier') {
                router.addRoute(cashierRoutes); // Add cashier routes dynamically
            }
            routesAdded = true;
            return next(to.fullPath); // Retry original route after adding new routes
        }
        next(); // Continue navigation if routes are already added
    } else {
        next('/login'); // If not authenticated, redirect to login
    }
});

export default router;
