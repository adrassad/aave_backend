import express from 'express';
import { getAllAssets } from '../../services/asset/asset.service.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getAllAssets());
});

export default router;
