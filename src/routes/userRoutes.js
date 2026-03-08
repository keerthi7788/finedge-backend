const express = require('express');
const router = express.Router();
const { validateJWT } = require('../middleware/validateJWT');
const {
    registerUser,
    loginUser,
    createUser,
    getUsers,
    getUserById,
    deleteUser
} = require('../controllers/userController');

// register user
router.post('/', async (req, res) => {
    const user = req.body;
    if (!user.email || !user.password) {
        res.status(400).send({ message: 'Email and password are required' });
        return;
    }
    const result = await registerUser(user);
    res.status(result.status).send({ message: result.message, user: result.user });
});

// POST /users/login - Authenticate user and return JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send({ message: 'Email and password are required' });
        return;
    }
    const result = await loginUser({ email, password });

    if (result.message === 'User not found') {
        res.status(404).send({ message: result.message, token: result.token });
    } else if (result.message === 'Wrong password') {
        res.status(401).send({ message: result.message, token: result.token });
    } else if (result.status === 500) {
        res.status(500).send({ message: result.message, token: null });
    } else {
        res.status(200).send({ message: result.message, token: result.token });
    }
});

router.use(validateJWT);

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

module.exports = router;