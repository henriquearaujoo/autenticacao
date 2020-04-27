const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const User = require('./model/user');
const Noticia = require('./model/noticia');
const port = process.env.port || 3000
mongoose.Promise = global.Promise;

const url = process.env.MONGODB || "mongodb://localhost:27017/noticias";

const noticiasRouter = require('./routes/noticia');
const restritoRouter = require('./routes/restrito');
const authRouter = require('./routes/auth');
const pagesRouter = require('./routes/pages');
const adminRouter = require('./routes/admin');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'fullstackmaster' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', authRouter);
app.use('/', pagesRouter);
app.use('/restrito', restritoRouter);
app.use('/noticias', noticiasRouter);
app.use('/admin', adminRouter);

const verificaUsuarioInicial = () => {
    User.collection.countDocuments({})
        .then((count) => {
            if (count === 0) {
                const user1 = new User({
                    username: 'user1',
                    password: '123',
                    roles: ['restrito', 'admin']
                })

                user1.save();

                const user2 = new User({
                    username: 'user2',
                    password: '123',
                    roles: ['restrito']
                })

                user2.save();
            }
        });
}

const noticiasIniciais = async() => {
    const noticia = new Noticia({
        title: 'Noticia publica',
        content: 'content',
        category: 'public'
    });
    await noticia.save();

    const noticia2 = new Noticia({
        title: 'Noticia privada',
        content: 'content',
        category: 'private'
    });

    await noticia2.save();
}

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection
connection.on('error', console.error.bind(console, 'Erro ao conectar com o mongo'));
connection.once('open', (erro) => {
    if (!erro) {
        app.listen(port, (erro) => {
            if (!erro) {

                console.log('Servidor rodando');

                verificaUsuarioInicial();
                //noticiasIniciais();

            }
        })
    }
})