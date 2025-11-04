import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Shield, Users, Package, Truck } from "lucide-react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import SunshineLogo from "../../../public/Sunshine_logo_black.png";

interface CustomerFormData {
  avatar: File | null;
  firstName: string;
  lastName: string;
  companyName?: string;
  mobile: string;
  email: string;
  address: string;
  state: string;
  city: string;
  cityPincode: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { saveAuthData } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    mode: "onChange",
    defaultValues: {
      terms: false,
    },
  });

  const password = watch("password");

  // States and cities data (keep your existing states array)
  const statesAndCities = [
    {
      state: "Delhi",
      cities: ["New Delhi", "Dwarka", "Chandni Chowk", "AIIMS", "Sultanpur", "Saket", "Rohini", "Karol Bagh"],
    },
    {
      state: "Maharashtra",
      cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
    },
    {
      state: "Karnataka",
      cities: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belagavi"],
    },
    {
      state: "Tamil Nadu",
      cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
    },
    {
      state: "Uttar Pradesh",
      cities: ["Lucknow", "Kanpur", "Varanasi", "Noida", "Ghaziabad"],
    },
    {
      state: "Gujarat",
      cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    },
    {
      state: "West Bengal",
      cities: ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"],
    },
    {
      state: "Rajasthan",
      cities: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"],
    },
    {
      state: "Telangana",
      cities: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
    },
    {
      state: "Madhya Pradesh",
      cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    },
    {
      state: "Kerala",
      cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Alappuzha"],
    },
    {
      state: "Punjab",
      cities: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Mohali"],
    },
    {
      state: "Haryana",
      cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
    },
    {
      state: "Bihar",
      cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    },
  ]


  // Handle avatar preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue("avatar", file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  // Form submission
  const onSubmit = async (data: CustomerFormData) => {
    try {
      const formData = new FormData();

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      if (data.companyName) formData.append("companyName", data.companyName);
      formData.append("mobile", data.mobile);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("cityPincode", data.cityPincode);
      formData.append("password", data.password);
      formData.append("country", "India");
      formData.append("role", "customer");

      const response = await axiosInstance.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.token && response.data?.user) {
        saveAuthData(response.data.user, response.data.token);
        toast.success("Registration successful!");
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Column (Fixed) */}
      <div className="hidden lg:block lg:w-1/2 bg-primary fixed left-0 h-screen">
        <div className="flex flex-col items-center justify-center h-full p-2 text-white">
          <Link to="/" className="bg-white rounded-full p-4 mb-0 shadow-md hover:shadow-lg transition-shadow">
            <img src={SunshineLogo} alt="Sunshine Logistics" className="w-20 h-20 object-contain" />
          </Link>

          <div className="flex items-center gap-2 text-4xl font-bold mb-0">
            <Truck className="w-12 h-12" />
            <span>CourierTrack</span>
          </div>

          <div className="space-y-4 max-w-lg">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Join Our Network Today</h2>
              <p className="text-lg opacity-90">
                Register now to access powerful shipping tools and manage your deliveries efficiently.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Package className="w-8 h-8 shrink-0" />
                <div>
                  <p className="font-semibold">Streamlined Shipping</p>
                  <p className="text-sm opacity-75">Manage all your shipments in one place</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Shield className="w-8 h-8 shrink-0" />
                <div>
                  <p className="font-semibold">Secure Platform</p>
                  <p className="text-sm opacity-75">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <Users className="w-8 h-8 shrink-0" />
                <div>
                  <p className="font-semibold">Team Collaboration</p>
                  <p className="text-sm opacity-75">Work together seamlessly with your team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Scrollable) */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="p-8 shadow-lg bg-white/80 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-primary">Register Your Account</h1>
                <p className="text-gray-600">Join Sunshine Logistics to streamline your shipping operations</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Profile Picture (optional)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setValue("avatar", file);
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      } else {
                        setPreview(null);
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  {preview && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={preview} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
                      <span className="text-sm text-gray-700">
                        {watch("avatar") instanceof File ? watch("avatar")?.name : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: { value: 2, message: "Minimum 2 characters" },
                      })}
                      className={`w-full ${errors.firstName ? "border-red-500" : ""}`}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: { value: 2, message: "Minimum 2 characters" },
                      })}
                      className={`w-full ${errors.lastName ? "border-red-500" : ""}`}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Company Name (optional)</label>
                  <Input
                    {...register("companyName")}
                    className="w-full"
                    placeholder="Your company name"
                  />
                </div>

                {/* Contact Information */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Mobile Number<span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("mobile", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Please enter a valid 10-digit mobile number",
                        },
                      })}
                      type="tel"
                      className={`w-full ${errors.mobile ? "border-red-500" : ""}`}
                    />
                    {errors.mobile && (
                      <p className="text-sm text-red-500">{errors.mobile.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      type="email"
                      className={`w-full ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Address<span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("address", {
                        required: "Address is required",
                        minLength: { value: 10, message: "Please enter a complete address" },
                      })}
                      className={`w-full ${errors.address ? "border-red-500" : ""}`}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        State<span className="text-red-500">*</span>
                      </label>
                      <Select
                        onValueChange={(value) => setValue("state", value)}
                      >
                        <SelectTrigger className={`w-full` + (errors.state ? "border-red-500" : "")}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {statesAndCities.map((item) => (
                            <SelectItem key={item.state} value={item.state}>
                              {item.state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-sm text-red-500">{errors.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        City<span className="text-red-500">*</span>
                      </label>
                      <Select
                        onValueChange={(value) => setValue("city", value)}
                        disabled={!watch("state")}
                      >
                        <SelectTrigger className={`w-full` + (errors.state ? "border-red-500" : "")}>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {watch("state") &&
                            statesAndCities
                              .find((item) => item.state === watch("state"))
                              ?.cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-sm text-red-500">{errors.city.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      PIN Code<span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register("cityPincode", {
                        required: "PIN Code is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Please enter a valid 6-digit PIN code",
                        },
                      })}
                      className={`w-full ${errors.cityPincode ? "border-red-500" : ""}`}
                      maxLength={6}
                    />
                    {errors.cityPincode && (
                      <p className="text-sm text-red-500">{errors.cityPincode.message}</p>
                    )}
                  </div>
                </div>

                {/* Password Section */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                              "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                          },
                        })}
                        className={`w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Confirm Password<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        className={`w-full pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      {...register("terms")}
                      onCheckedChange={(checked) => setValue("terms", !!checked)}
                      defaultChecked
                    />
                    <label className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-500">{errors.terms.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/90 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}