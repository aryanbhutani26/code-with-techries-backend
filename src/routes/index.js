import express from 'express';
import studentRoute from './studentRoutes.js';

const router = express.Router();

const Routes = [
    {
        path: "/students",
        route: studentRoute,
    },
];

Routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;