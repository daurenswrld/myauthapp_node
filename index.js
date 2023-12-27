const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 3000;

// Подключение к базе данных
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log("Подключено к базе данных"))
    .catch(err => console.error('Ошибка подключения к базе данных', err.stack));

// Middleware для разбора URL-encoded данных (для данных из форм)
app.use(express.urlencoded({ extended: true }));

// Middleware для разбора JSON
app.use(express.json());

// Настройка сессий
app.use(session({
    secret: 'секретный_ключ',
    resave: false,
    saveUninitialized: false
}));

// Настройка Express для использования EJS
app.set('view engine', 'ejs');

// Маршруты для отображения страниц регистрации и входа и главной страницы
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Маршрут для регистрации пользователя
app.post('/register', async (req, res) => {
    console.log(req.body); // Для отладки
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Необходимо указать имя пользователя и пароль');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, hashedPassword], (error, results) => {
            if (error) {
                res.status(400).send('Ошибка при регистрации пользователя');
                return;
            }
            res.status(201).send(`Пользователь добавлен с ID: ${results.rows[0].id}`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка на сервере');
    }
});

// Маршрут для входа в систему
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
        if (error) {
            res.status(400).send('Ошибка при входе в систему');
            return;
        }

        if (results.rows.length > 0) {
            const user = results.rows[0];

            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id; // Сохранение ID пользователя в сессии
                res.send('Вы успешно вошли в систему!');
            } else {
                res.status(401).send('Неверный пароль');
            }
        } else {
            res.status(404).send('Пользователь не найден');
        }
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
