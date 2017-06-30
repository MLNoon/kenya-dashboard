// routes.js
const nextRoutes = require('next-routes');
const routes = module.exports = nextRoutes();

// ========================= APP ROUTES =====================
routes.add('home', '/', 'index');
routes.add('panel', '/panel', 'panel');
routes.add('indicator', '/panel/:indicator', 'panel');
routes.add('compare', '/compare', 'compare');
routes.add('about', '/about', 'about');
