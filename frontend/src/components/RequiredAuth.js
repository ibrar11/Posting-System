import { useLocation, Navigate, Outlet } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const RequiredAuth = () => {
    const { auth } = useAuthContext();
    const location = useLocation();

    return (
        auth?.id 
            ? <Outlet/> : <Navigate to={'/'} state={{ from: location }} replace />
    )
}

export default RequiredAuth;