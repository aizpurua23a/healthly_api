var express = require('express');
var router = express.Router();

var day_controller = require('../controllers/dayController');

/// day ROUTES ///
// GET catalog home page.
router.get('/', day_controller.index);

module.exports = router;
