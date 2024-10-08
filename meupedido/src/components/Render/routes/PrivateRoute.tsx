import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuth();

    return user ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
