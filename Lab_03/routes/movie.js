const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('view/index', {title: 'test'});
});

module.exports = router;