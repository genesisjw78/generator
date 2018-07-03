const express = require('express');
const router = express.Router();

const Format = require('response-format');

router.get('/', function (req, res) {
	res.json(
		Format.success(null)
	);
});

module.exports = router;