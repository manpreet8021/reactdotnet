import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/dashboard/ActivityDetails";
import TestErrors from "../../features/error/TestError";
import NotFound from "../../features/error/NotFound";
import ServerError from "../../features/error/ServerError";
import LoginForm from "../../features/users/LoginForm";
import ProfilePage from "../../features/profile/ProfilePage";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {path: 'activities', element: <ActivityDashboard />},
            {path: 'activities/:id', element: <ActivityDetails />},
            {path: 'createActivity', element: <ActivityForm key="create" />},
            {path: 'updateActivity/:id', element: <ActivityForm key="update" />},
            {path: 'login', element: <LoginForm />},
            {path: 'profiles/:username', element: <ProfilePage />},
            {path: 'error', element: <TestErrors />},
            {path: 'not-found', element: <NotFound />},
            {path: 'server-error', element: <ServerError />},
            {path: '*', element: <NotFound />}
        ]
    }
]

export const router = createBrowserRouter(routes);