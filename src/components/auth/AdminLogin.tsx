import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../../services/axiosInstance";

interface FormInputs {
  email: string;
  password: string;
  remember?: boolean;
}

interface JwtPayload {
  role: string;
  exp?: number;
}

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isCheckingAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { saveAuthData } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  // Function to redirect user based on their role
  const redirectUserByRole = (userRole: string) => {
    switch (userRole.toLowerCase()) {
      case 'admin':
      case 'adminuser':
        navigate('/customer-users', { replace: true });
        break;
      case 'agentuser':
        navigate('/orders', { replace: true });
        break;
      default:
        // If role doesn't match any known role, redirect to event page as fallback
        navigate('/orders', { replace: true });
        break;
    }
  };

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const response = await axiosInstance.post("/api/auth/admin-login", {
        email: data.email,
        password: data.password,
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        const payload: JwtPayload = jwtDecode(token);
        const userRole = payload.role?.toLowerCase() ?? "";

        if (response.data.admin) {
          saveAuthData(response.data.admin, token);
        }

        redirectUserByRole(userRole);
        toast.success("Login successful!");
      } else {
        setLoginError("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F5F5] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#004A89] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#004A89] font-medium">Checking authentication...</p>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 relative">
      {/* Back to Website Link */}
      <div className="absolute top-4 left-4 z-10">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-primary hover:text-blue-600 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="font-medium">Back to Website</span>
        </Link>
      </div>

      {/* Center Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-2">
        <Card className="w-full max-w-md shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="px-4">
            <div className="flex flex-col items-center space-y-6">
              {/* Logo */}
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-primary"
                >
                  <path d="M12 4H6a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-6m-1.586-5.414A2 2 0 0 0 16 5.172V3h-2.172a2 2 0 0 0-1.414.586L5 11v5h5l7.414-7.414z"/>
                  <path d="M18 3v4"/>
                  <path d="M14 7h4"/>
                </svg>
              </div>

              {/* Welcome text */}
              <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent text-2xl font-bold text-gray-900 md:text-3xl">
                  Administrative Portal
                </h2>
                <div className="flex flex-col gap-1">
                  <p className="text-base text-primary font-semibold">
                    Sunshine Logistics Control Panel
                  </p>
                  <p className="text-sm text-gray-500">
                    Access your admin dashboard to manage shipments, users, and operations
                  </p>
                </div>
              </div>

              {/* Auth form */}
              <div className="w-full">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email<span className="text-red-700">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        {...register("email", { required: "Email is required" })}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password<span className="text-red-700">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          {...register("password", { required: "Password is required" })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-sm text-red-500">{loginError}</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-semibold py-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                    size="lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                          <polyline points="10 17 15 12 10 7"/>
                          <line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                        Access Admin Portals
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}