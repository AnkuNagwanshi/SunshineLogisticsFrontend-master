import { Navigate, Outlet } from "react-router-dom";
import ProtectedAppLayout from "./ProtectedAppLayout";
import { useAuth } from "@/context/AuthContext";
// export function ProtectedRoute() {
//   const authToken = sessionStorage.getItem("authToken");

//   if (!authToken) {
//     return <Navigate to="/login" replace />;
//   }

//   return authToken ? (
//     <ProtectedAppLayout>
//       <Outlet />
//     </ProtectedAppLayout>
//   ) : (
//     <Navigate to="/login" replace />
//   );
// }

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles = [] }: ProtectedRouteProps) {
  const { user, getToken } = useAuth();
  // const token = sessionStorage.getItem("adminToken") ||
  //               sessionStorage.getItem("agentToken") ||
  //               sessionStorage.getItem("customerToken");
  // const role = sessionStorage.getItem("userRole");

  const token = getToken();
  const role = user?.role || sessionStorage.getItem("userRole");

  if (!token) return <Navigate to="/login" replace />;
   // ✅ Safely check role with optional chaining & null fallback
 if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  return (
    <ProtectedAppLayout>
      <Outlet />
    </ProtectedAppLayout>
  );
}
