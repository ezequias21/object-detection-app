module.exports = {
    node_env: process.env.node_env | 'testing',
    server: {
        port: process.env.PORT || 3000
    },
    database: {
        url: process.env.DB_URL || 'mongodb://localhost:27017/meuBancoDeDados'
    },
    secret: process.env.SECRET || 'secret'
};
