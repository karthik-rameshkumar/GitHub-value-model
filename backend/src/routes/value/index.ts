import { Router } from 'express';
import calculatorRoutes from './calculator';
import dashboardRoutes from './dashboard';

const router = Router();

// Value calculator calculation routes
router.use('/v1/value-calculator', calculatorRoutes);

// Value dashboard data routes  
router.use('/v1/value-dashboard', dashboardRoutes);

export default router;