import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Core components (non-lazy, critical path)
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CustomerProtectedRoute } from "@/components/CustomerProtectedRoute";
import AppLayout from "@/layout/AppLayout";

// import components - Auth
import AdminLogin from "@/components/auth/AdminLogin";
import { LoginPage } from "@/components/auth/Login";
import { RegisterPage } from "@/components/auth/Register";



// Lazy-loaded components - Dashboard (Admin)
const CustomerUsers = lazy(() => import("@/components/dashboard/CustomerUsers"));
const DeliveryAgent = lazy(() => import("@/components/dashboard/DeliveryAgent"));
const Orders = lazy(() => import("@/components/dashboard/Orders"));

// Lazy-loaded components - Public Pages
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Services = lazy(() => import("@/pages/Services"));
const Track = lazy(() => import("@/pages/Track"));
const RequestPickup = lazy(() => import("@/pages/RequestPickup"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Optional loader (replace with a spinner if you have one)
const Loader = () => <div className="p-4 text-center">Loading...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Auth Routes */}
        <Route path='/admin' element={<AdminLogin />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customer-registration" element={<RegisterPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/customer-users" element={<CustomerUsers />} />
          <Route path="/delivery-agent" element={<DeliveryAgent />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin", "delivery_agent"]} />}>
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* Public Routes with AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/services" element={<Services />} />

          <Route path="/track" element={<Track />} />
          <Route path="/request-pickup" element={<RequestPickup />} />

          {/* Placeholder routes - will load Agenda component for now */}
          {/* <Route path="/faq" element={<FAQ />} />
          <Route path="/report" element={<Report />} />
          <Route path="/download" element={<Download />} />
          <Route path="/press-kit" element={<PressKit/>} /> */}

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* ✅ Customer-only protected pages */}
        {/* <Route element={<CustomerProtectedRoute />}>
          <Route path="/track" element={<Track />} />
          <Route path="/request-pickup" element={<RequestPickup />} />
        </Route> */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
