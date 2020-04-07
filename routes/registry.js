var express = require('express');
var router = express.Router();

var day_controller = require('../controllers/dayController');

/// day ROUTES ///
// GET catalog home page.
router.get('/', day_controller.index);
router.get('/days', day_controller.day_list);
router.get('/day/:date',day_controller.day_details);
router.post('/day/create', day_controller.day_create_post);
router.put('/day/:date/update', day_controller.day_update_put);
router.delete('/day/:date', day_controller.day_delete);

module.exports = router;
