import express from 'express';
import studentRoute from './studentRoutes.js';
import recruiterRoute from "./recruiterRoutes.js";
import developerRoute from "./developerRoutes.js";
import teacherRoute from "./teacherRoutes.js";

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
    {
        path: "/developers",
        route: developerRoute,
    },
    {
        path: "/teachers",
        route: teacherRoute,
    },
];

Routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;