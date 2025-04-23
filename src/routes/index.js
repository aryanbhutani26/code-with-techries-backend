import express from 'express';
import studentRoute from './studentRoutes.js';
import recruiterRoute from "./recruiterRoutes.js";

const router = express.Router();

const Routes = [
    {
        path: "/students",
        route: studentRoute,
    },
    {
        path: "/recruiters",
        route: recruiterRoute,
    },
];

Routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;