const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');

const db = require('./db/connection');

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173', // your Vue app's origin
    credentials: true
}));

app.use(session({
    secret: 'your_secret',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({}, db),
    cookie: {
        httpOnly: true,
        secure: false, // true if using HTTPS
        maxAge: 3600000
    }
}));

// Routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const roleRoutes = require('./routes/role.route');
const patientRoutes = require('./routes/patient.route');
const medicalRecordsRoutes = require('./routes/medical_records.route');
const companyRoutes = require("./routes/company.route");
const contractRoutes = require("./routes/contract.route")
const specialtyRoutes = require('./routes/specialty.route');
const medicalRecordPrestationRoutes = require('./routes/medical_record-prestation.route');
const prestationRoutes = require('./routes/prestation.route');
const doctorRoutes = require('./routes/doctor.route');
const paiementRoutes = require('./routes/paiement.routes');

const testRoutes = require('./routes/test.route');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use("/api/companies", companyRoutes)
app.use("/api/contracts", contractRoutes)
app.use('/api/specialties', specialtyRoutes);
app.use('/api/medical-record-prestations', medicalRecordPrestationRoutes);
app.use('/api/prestations', prestationRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/paiements', paiementRoutes);

app.use('/api', testRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));