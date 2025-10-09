import { Navigate } from "react-router";
import { useAuthUser } from "../hooks/useAuth";

type Props = {
    children: React.ReactElement;
}

export default function ProtectedRoute({children}: Props){
    const {data: user, isLoading, isError} = useAuthUser();

    if(isLoading) {
        return <div className="p-6 text-center">Yükleniyor...</div>;
    }

    if (isError || !user) {
        return <Navigate to="/" replace />;  // ⬅️ burada "/login" değil "/"
      }

    return children;
}