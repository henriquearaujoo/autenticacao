const express = require('express');
const router = express.Router();

const User = require('../model/user');

router.use((req, res, next) => {
    if ('user' in req.session) {
        res.locals.user = req.session.user;
        res.locals.role = req.session.role;
    }
    next();
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        const isValid = await user.checkPassword(req.body.password);
        if (isValid) {
            req.session.user = user;
            req.session.role = user.roles[0];
            res.redirect('/restrito/noticias');
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
})

router.get('/change-role/:role', (req, res) => {
    req.session.role = req.params.role
    res.redirect('/');
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('Sessão destruida');
    });
    res.redirect('/');
})

module.exports = router;