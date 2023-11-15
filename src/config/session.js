
const config = require('./config')
const session = require('express-session');

const sessionConfig = {
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: config.node_env === 'production', // Defina para true se estiver usando HTTPS em produção
        maxAge: 24 * 60 * 60 * 1000, // Tempo de vida do cookie de sessão em milissegundos (1 dia)
    }
};

module.exports = session(sessionConfig);
