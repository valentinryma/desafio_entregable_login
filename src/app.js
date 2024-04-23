// Dependencias
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose')

const sessionMiddleware = require(`${__dirname}/session/mongoStorage`);

// Handlebars Config.
const app = express()

// Public
app.use(express.static(`${__dirname}/../public`));

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// Express Config.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(sessionMiddleware);

// Routes
const viewsRouter = require(`${__dirname}/routes/views.route.js`);
const productsRouter = require(`${__dirname}/routes/products.route.js`);
const cartsRouter = require(`${__dirname}/routes/carts.route.js`);
const sessionsRouter = require(`${__dirname}/routes/sessions.route.js`)

// Managers
const ProductManager = require(`${__dirname}/dao/controllers/productManager.js`)
const CartManager = require(`${__dirname}/dao/controllers/cartManager.js`)

// Endpoints
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

const main = async () => {
    // Conexion DB
    const { mongoUrl, dbName } = require(`${__dirname}/dbConfig.js`);
    await mongoose.connect(mongoUrl, { dbName })

    // Instancias Managers
    const productManager = new ProductManager();
    const cartManager = new CartManager();

    // Verifica que se haya conectado correctamente
    await productManager.prepare();
    await cartManager.prepare();

    // Instancias de los Managers en req.app.get(Manager)
    app.set('productManager', productManager);
    app.set('cartManager', cartManager);

    // HTTP Server on.
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Sever on http://localhost:${PORT}/login`);
    });
};

main();


