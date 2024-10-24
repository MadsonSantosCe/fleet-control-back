import { Router } from 'express';
import { createTruck, getTrucks, getTruckById, updateTruck, deleteTruck } from '../controllers/truckController';

const router = Router();

router.post('/truck', createTruck);
router.get('/trucks', getTrucks);
router.get('/truck/:id', getTruckById);
router.put('/truck/:id', updateTruck);
router.delete('/truck/:id', deleteTruck);

export default router;