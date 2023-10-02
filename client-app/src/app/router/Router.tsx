import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/dashboard/ActivityDetails";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {path: 'activities', element: <ActivityDashboard />},
            {path: 'activities/:id', element: <ActivityDetails />},
            {path: 'createActivity', element: <ActivityForm key="create" />},
            {path: 'updateActivity/:id', element: <ActivityForm key="update" />}
        ]
    }
]

export const router = createBrowserRouter(routes);