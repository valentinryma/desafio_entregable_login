const { Router } = require('express')
const router = Router();
const User = require(`${__dirname}/../dao/models/user.model`);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Invalid credentials' })
    }

    // Verficia que exista el user en la DB
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.status(404).json({ error: 'User not found!' })
    }

    // Crea una nueva sesion si el user existe
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = { rol: 'admin' }
    } else {
        req.session.user = { rol: 'user' }
    }

    req.session.user = {
        ...req.session.user,
        email,
        _id: user._id.toString()
    }

    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    req.session.destroy((_) => {
        res.redirect('/login');
    });
})

router.post('/register', async (req, res) => {
    const { firstName, lastName, age, email, password } = req.body;

    try {
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            age: +age,
            email: email,
            password: password
        })

        if (!user) {
            return res.status(400).json({ error: 'anda sabe' });
        }

        // Hacemos que al registrarse directamente obtenga una session (login)
        req.session.user = { email, _id: user._id.toString() }
        res.redirect('/profile');

    } catch (err) {
        return res.status(500).json({ error: err });
    }


})

module.exports = router