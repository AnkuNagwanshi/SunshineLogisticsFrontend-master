import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormDialog } from "./FormDialog";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


import { AgentFormData } from "../commons/types";

// interface AgentFormData {
//   id?: number;
//   avatar: File | null;
//   firstName: string;
//   lastName: string;
//   // compnayName:string;
//   mobile:string;
//   email: string;
//   // address:string;
//   country: string;
//   state: string;
//   city: string;
//   cityPincode: string;
//   password?: string;
// }

interface AgentFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AgentFormData>;
  onSubmit: (data: AgentFormData) => void;
  isSubmitting?: boolean;
}

export function DeliveryAgentForm({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  // isSubmitting = false,
}: AgentFormProps) {
  const [formData, setFormData] = useState<AgentFormData>({
    avatar: null as File | null | string,
    firstName: "",
    lastName: "",
    // compnayName:"",
    mobile:"",
    email: "",
    // address:"",
    country: "India",
    state: "",
    city: "",
    cityPincode:"",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🧭 State-City Data
  const statesAndCities = [
    { state: "Delhi", cities: ["New Delhi", "Okhla", "Shaheen Bagh", "Dwarka", "Chandni Chowk", "Chhatarpur", "Sultanpur", 
      "Rohini", "Karol Bagh", "Saket"] },
    { state: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Varanasi", "Greater Noida", "Noida", "Faridabad", "Ghaziabad",  
      "Hapur", "Meerut","Bulandshahr", "Sikandrabad",
    ] },
    { state: "Andhra Pradesh", cities: ["Visakhapatnam", "Hyderabad", "Vijayawada", "Nellore", "Guntur"] },
    { state: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"] },
    { state: "Karnataka", cities: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belagavi"] },
    { state: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"] },
    { state: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"] },
    { state: "West Bengal", cities: ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"] },
    { state: "Rajasthan", cities: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"] },
    { state: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"] },
    { state: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"] },
    { state: "Kerala", cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Alappuzha"] },
    { state: "Punjab", cities: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Mohali"] },
    { state: "Haryana", cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"] },
    { state: "Bihar", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"] },
  ];

  // 🧭 Get cities for selected state
  const cities = formData.state
    ? statesAndCities.find((item) => item.state === formData.state)?.cities || []
    : [];

  // ✅ Prefill when editing existing agent
  useEffect(() => {
    if (isOpen) {
      // When form opens — populate fields if editing, else reset
      setError(null);

      if (initialData) {
        console.log('Initial data avatar:', initialData.avatar); // Debug log
        
        setFormData({
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          // companyName: initialData.companyName || "",
          mobile: initialData.mobile || "",
          email: initialData.email || "",
          // address: initialData.address || "",
          country: initialData.country || "India",
          state: initialData.state || "",
          city: initialData.city || "",
          cityPincode: initialData.cityPincode || "",
          password: "",
          avatar: initialData.avatar || null,
        });

        // If avatar is a URL, use it directly for preview
        const avatarUrl = typeof initialData.avatar === "string" 
          ? (initialData.avatar.startsWith('http') 
             ? initialData.avatar 
             : `${import.meta.env.VITE_API_BASE_URL}${initialData.avatar}`)
          : null;
        
        console.log('Setting preview URL:', avatarUrl); // Debug log
        setPreview(avatarUrl);
      } else {
      // 👇 If no initialData (i.e. Add New Agent), clear everything
      setFormData({
        avatar: null,
        firstName: "",
        lastName: "",
        // companyName: "",
        mobile:"",
        email: "",
        // address:"",
        country: "India",
        state: "",
        city: "",
        cityPincode: "",
        password: "",
      });
      setPreview(null);
    }
  } else {
    // When form closes
    setFormData({
     avatar: null,
        firstName: "",
        lastName: "",
        // companyName: "",
        mobile:"",
        email: "",
        // address:"",
        country: "India",
        state: "",
        city: "",
        cityPincode: "",
        password: "",
    });
    setPreview(null);
  }
}, [isOpen, initialData]);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      if (files && files.length > 0) {
        // New file selected
        const file = files[0];
        setFormData((prev) => ({ ...prev, avatar: file }));
        setPreview(URL.createObjectURL(file));
      } else {
        // No file selected (cleared)
        setFormData((prev) => ({ ...prev, avatar: null }));
        setPreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle avatar change
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   setFormData((prev) => ({ ...prev, avatar: file }));
  // };

  // ✅ Handle input change
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit(formData);
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.state || !formData.city) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // toast.success(
      //   initialData ? "Agent updated successfully!" : "Agent added successfully!"
      // );
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "", 
      lastName: "", 
      // companyName: "",
      mobile:"",
      email: "", 
      // address: "",
      country: "India", 
      state: "", 
      city: "",
      cityPincode: "",
      password: "",
      avatar: null
    });
    setPreview(null);
    onClose();
  };


  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      className="min-w-3xl"
      title={initialData ? "Update Delivery Agent" : "Add New Delivery Agent"}
      description={
        initialData
          ? "Update delivery agent information in the system."
          : "Add a new delivery agent to the system."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Last Name */}
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Mobile */}
          <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              type="mobile"
              value={formData.mobile || ""}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Password (only for new agent) */}
          {!initialData && (
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              type="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter Country"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
              <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, state: value, city: "" }))
              }
            >
              <SelectTrigger className="w-full">
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
            {/* {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>} */}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country">City</Label>
              <Select
              value={formData.city}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
              disabled={!formData.state}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>} */}
          </div>
          
           <div className="grid gap-2">
            <Label htmlFor="cityPincode">City Pincode</Label>
            <Input
              id="cityPincode"
              name="cityPincode"
              type="number"
              value={formData.cityPincode || ""}
              onChange={handleChange}
              placeholder="Enter City Pincode"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Avatar Upload */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="avatar">Avatar (optional)</Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {formData.avatar instanceof File && (
              <p className="text-sm text-gray-500">
                Selected: {formData.avatar.name}
              </p>
            )}
            {preview && (
              <div className="mt-2">
                <img 
                  src={preview} 
                  alt="Avatar preview" 
                  className="w-12 h-12 rounded-full object-cover border"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    setPreview(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>


        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline"
            // onClick={onClose} 
            onClick={handleClose}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#004A89] hover:bg-[#004A89]/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting
              ?
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...
              </>
              // "Submitting..."
              : initialData
                ? "Update Delivery Agent"
                : "Add Delivery Agent"}
          </Button>
        </div>
      </form>
    </FormDialog>
  );
}
