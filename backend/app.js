const express = require('express');
const cors = require('cors');
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const roleRoutes = require('./routes/role.route');
const patientRoutes = require('./routes/patient.route');
const medicalRecordsRoutes = require('./routes/medical_records.route');
const companyRoutes=require("./routes/company.route");
const contractRoutes=require("./routes/contract.route")
const specialtyRoutes = require('./routes/specialty.route');
const medicalRecordPrestationRoutes = require('./routes/medical_record-prestation.route');

const testRoutes = require('./routes/test.route');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use("/api/companies",companyRoutes)
app.use("/api/contracts",contractRoutes)
app.use('/api/specialties', specialtyRoutes);
app.use('/api/medical-record-prestations', medicalRecordPrestationRoutes);

app.use('/api', testRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));