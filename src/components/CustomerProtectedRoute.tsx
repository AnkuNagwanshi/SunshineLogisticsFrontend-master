import { Navigate, } from "react-router-dom";

// import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/layout/AppLayout";

export function CustomerProtectedRoute() {
      const user = localStorage.getItem("userData");
      console.log('user from customer - ', user)
    // const { user } = useAuth(); // use AuthContext
    // console.log(user);

    if (!user) {
        console.log('no user')
        // If no user, show 404 instead of redirecting to login
        return <Navigate to="/404" replace />;
    }

    // return (
    //     <AppLayout>
    //         <Outlet />
    //     </AppLayout>
    // );

    return <AppLayout />; // ✅ No children here
}
