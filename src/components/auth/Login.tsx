import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { jwtDecode } from "jwt-decode"
import SunshineLogo from "../../../public/Sunshine_logo_black.png";

// shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// lucide icons
import { Eye, EyeOff, Package, Truck } from "lucide-react"

// other imports
import axiosInstance from "../../services/axiosInstance"
// import { setSessionItem } from "../../lib/helperFucntion"

// context import 
import { useAuth } from "@/context/AuthContext"

interface FormInputs {
  email: string
  password: string
  remember?: boolean
}

interface JwtPayload {
  role: string
  exp?: number
}

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  // ✅ Centralized auth saving logic | authContext
  const { saveAuthData, setUser } = useAuth() // ✅ from context

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>()

  // Function to redirect user based on their role
  const redirectUserByRole = (userRole: string) => {
    switch (userRole.toLowerCase()) {
      case 'admin':
      case 'adminuser':
        navigate('/customer-users', { replace: true })
        break
      case 'delivery_agent':
      case 'deliveryagentuser':
        navigate('/orders', { replace: true })
        break
      case 'customer':
      case 'customeruser':
        navigate('/request-pickup', { replace: true })
        break
      default:
        // If role doesn't match any known role, redirect to event page as fallback
        navigate('/', { replace: true })
        break
    }
  }

  // useEffect(() => {
  //   const checkExistingAuth = () => {
  //     try {
  //       const userCredentials = localStorage.getItem("userCredentials")
  //       const authToken = sessionStorage.getItem("authToken")

  //       if (userCredentials && authToken) {
  //         const userData = JSON.parse(userCredentials)
  //         const userRole = userData.Role
  //         console.log('userData:', userData)

  //         // Verify token is still valid
  //         const decoded: JwtPayload = jwtDecode(authToken)
  //         const currentTime = Date.now() / 1000

  //         if (decoded.exp && decoded.exp > currentTime) {
  //           // Valid token → set user in AuthContext
  //           setUser(JSON.parse(localStorage.getItem("userData") || "{}"))
  //           return
  //         } else {
  //           localStorage.removeItem("userCredentials")
  //           sessionStorage.removeItem("authToken")
  //           localStorage.removeItem("userData")
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error checking authentication:", error)
  //       localStorage.clear()
  //       sessionStorage.clear()
  //     } finally {
  //       setIsCheckingAuth(false)
  //     }
  //   }

  //   checkExistingAuth()
  // }, [setUser])

  // ✅ Check stored login on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userData")
    const role = sessionStorage.getItem("userRole")

    if (storedUser && role) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      redirectUserByRole(parsedUser.role)
    }
    setIsCheckingAuth(false)
  }, [setUser])

  // Form submit
  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true)
    setLoginError(null)
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      })

      console.log("Response Data:", response.data)
      if (response.data && response.data.token) {
        const token = response.data.token
        const payload: JwtPayload = jwtDecode(token)
        // const userRole = payload.role ?? ""
        const userRole = payload.role?.toLowerCase() ?? "";
        console.log("userRole :", userRole);

        if (response.data.user) {
          // 🔥 Use central save method (handles userRole & tokens automatically)
          saveAuthData(response.data.user, token)
        }

        toast.success("Login successful!")
        redirectUserByRole(userRole)
      } else {
        setLoginError("Invalid response from server. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F5F5] to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#004A89] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#004A89] font-medium">Checking authentication...</p>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br  from-primary to-primary backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="flex justify-center w-full mb-3">
            <div className="bg-white rounded-full p-4 flex items-center justify-center shadow-md">
              <a href="/">
              <img
                src={SunshineLogo}
                alt="Sunshine Logistics"
                className="w-20 h-20 object-contain"
              />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-4xl font-bold mb-6">
            <Truck className="w-12 h-12" />
            <span>CourierTrack</span>
          </div>
          <div className="space-y-6 max-w-lg">
            <h2 className="text-3xl font-bold">
              Transform Your Shipping Experience
            </h2>
            <p className="text-lg opacity-90">
              Track shipments, manage deliveries, and streamline your logistics
              operations all in one powerful platform.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Package className="w-8 h-8" />
                <div>
                  <p className="font-semibold">Real-time Tracking</p>
                  <p className="text-sm opacity-75">
                    Monitor your shipments 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20 pattern-dots pattern-blue-500 pattern-bg-transparent pattern-size-4 pattern-diagonal-lines" />
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Hi, <span className="text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Welcome</span> Back
            </h1>
            <p className="text-muted-foreground text-gray-600">
              Enter your credentials to access your account
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="bg-primary/10 px-4 py-2 rounded-full">
                <Truck size={20} className="text-primary inline-block mr-2" />
                <span className="text-sm font-medium text-primary">Agent Login</span>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-full">
                <Package size={20} className="text-primary inline-block mr-2" />
                <span className="text-sm font-medium text-primary">Customer Login</span>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email<span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
{/* 
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  {...register("remember")}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary hover:text-primary/90"
              >
                Forgot password?
              </a>
            </div> */}

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
                "Sign in"
              )}
            </Button>

            <div className="relative mb-2 ">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500">
                  New to Sunshine Logistics?
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/customer-registration"
                className="font-semibold text-primary hover:text-blue-600 transition-colors"
              >
                Sign up for free
                <span className="ml-1 inline-block transform hover:translate-x-1 transition-transform">→</span>
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
