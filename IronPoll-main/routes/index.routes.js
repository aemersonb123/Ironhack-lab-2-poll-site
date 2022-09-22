const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { username: req.session?.user?.username });
});

module.exports = router;
