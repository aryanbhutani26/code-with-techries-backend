import express from 'express';
import studentRoute from './studentRoutes.js';
import recruiterRoute from "./recruiterRoutes.js";
import developerRoute from "./developerRoutes.js";
import teacherRoute from "./teacherRoutes.js";
import adminRoute from "./adminRoutes.js";
import careerRoute from "./careerRoutes.js";
import classRoute from "./classRoutes.js";
import authRoute from "./authRoutes.js"; // Import the new auth route
const router = express.Router();

const Routes = [
    {
        path: "/students",
        route: studentRoute,
    }, {
        path: "/auth", // Add the path for authentication routes
        route: authRoute,
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
    {
        path: "/admin",
        route: adminRoute,
    },
    {
        path: "/careers",
        route: careerRoute,
    },
    {
        path: "/classes",
        route: classRoute,
    },
];

Routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;