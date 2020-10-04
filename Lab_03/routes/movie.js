const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('view/index', {title: 'test', body: 'test'});
});

module.exports = router;
