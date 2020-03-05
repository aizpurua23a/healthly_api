var express = require('express');
var router = express.Router();

var day_controller = require('../controllers/dayController');

/// day ROUTES ///
// GET catalog home page.
router.get('/', day_controller.index);
router.get('/days', day_controller.day_list);
router.get('/days/create', day_controller.day_create_get);
router.post('/days/create', day_controller.day_create_post);
router.get('/day/:id',day_controller.day_details);
router.get('/day/:id/update', day_controller.day_update_get);
router.post('/day/:id/update', day_controller.day_update_post);

module.exports = router;
