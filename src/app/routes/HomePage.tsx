import { Navigate } from "react-router-dom";
import { useAuthUser } from "../../features/auth/hooks/useAuth";
import Hero from "../../features/auth/components/Hero";

export default function HomePage() {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <Hero />
    </div>
  );
}
