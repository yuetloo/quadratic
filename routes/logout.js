'use strict'

const express = require('express');
const router = express.Router();

/* logout */
router.get('/', async (req, res, next) => {
  req.sesion.destroy();
  res.json({ success: true });
})
  
module.exports = router;
