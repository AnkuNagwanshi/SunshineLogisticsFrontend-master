import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axiosInstance from "@/services/axiosInstance";
import { Loader2, Trash2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

interface AddCustomerFormProps {
  onSuccess?: () => void;
  customerId?: number;
  initialData?: CustomerFormData;
  isEditMode?: boolean;
}

export interface CustomerFormData {
  name: string;
  email: string;
  mobile: string;
  companyName: string;
  gstNumber: string;
  address: string;
  pincode: string;
  pickupAddress: string[];
}

export function AddCustomerForm({ onSuccess, customerId, initialData, isEditMode = false }: AddCustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(
    initialData || {
      name: "",
      email: "",
      mobile: "",
      companyName: "",
      gstNumber: "",
      address: "",
      pincode: "",
      pickupAddress: [""],
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addPickupLocation = () => {
    setFormData((prev) => ({
      ...prev,
      pickupAddress: [...prev.pickupAddress, ""],
    }));
  };

  const removePickupLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pickupAddress: prev.pickupAddress.filter((_, i) => i !== index),
    }));
  };

  const handlePickupLocationChange = (index: number, value: string) => {
    const updated = [...formData.pickupAddress];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, pickupAddress: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Filter out empty pickup addresses
      const filteredPickupAddresses = formData.pickupAddress.filter(
        (addr) => addr.trim() !== ""
      );

      const dataToSend = {
        ...formData,
        pickupAddress: filteredPickupAddresses,
        gstNumber: formData.gstNumber || null,
      };

      console.log("Sending data:", dataToSend);

      if (isEditMode && customerId) {
        // Edit mode - PUT request
        await axiosInstance.put(`/api/add_customer/${customerId}`, dataToSend);
        toast.success("✅ Customer updated successfully!");
        onSuccess?.();
      } else {
        // Add mode - POST request
        await axiosInstance.post("/api/add_customer", dataToSend);
        toast.success("✅ Customer added successfully!");
        onSuccess?.();
        
        // Reset form only in add mode
        setFormData({
          name: "",
          email: "",
          mobile: "",
          companyName: "",
          gstNumber: "",
          address: "",
          pincode: "",
          pickupAddress: [""],
        });
      }
    } catch (error: any) {
      console.error(isEditMode ? "Error updating customer:" : "Error adding customer:", error);
      
      // Extract detailed error message from API response
      let errorMessage = isEditMode 
        ? "Failed to update customer. Please try again." 
        : "Failed to add customer. Please try again.";
      
      if (error.response?.data?.error) {
        // Backend validation errors (GST, mobile, email format, etc.)
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 409) {
        errorMessage = "A customer with this email already exists";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check all fields.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 mb-8 bg-white rounded-xl shadow-md max-w-3xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-blue-600 text-center">
        {isEditMode ? "Edit Customer" : "Add New Customer"}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="grid gap-2">
          <Label>Name *</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
            disabled={loading}
          />
        </div>

        {/* Company Name */}
        <div className="grid gap-2">
          <Label>Company Name</Label>
          <Input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            disabled={loading}
          />
        </div>
        
        {/* Mobile */}
        <div className="grid gap-2">
          <Label>Mobile *</Label>
          <Input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="10 digit mobile number"
            pattern="[0-9]{10}"
            title="Mobile number must be 10 digits"
            maxLength={10}
            required
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label>Email *</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            disabled={loading}
          />
        </div>

        {/* GST Number (Optional) */}
        <div className="grid gap-2 md:col-span-2">
          <Label>GST Number (Optional)</Label>
          <Input
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="15 character GST number (e.g., 27AABCU9603R1ZX)"
            maxLength={15}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            Format: 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric
          </p>
        </div>

        {/* Address */}
        <div className="grid gap-2 md:col-span-2">
          <Label>Customer Address *</Label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter customer address"
            required
            disabled={loading}
          />
        </div>

        {/* Pincode */}
        <div className="grid gap-2 md:col-span-2">
          <Label>Pincode *</Label>
          <Input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="6 digit pincode"
            pattern="[0-9]{6}"
            title="Pincode must be 6 digits"
            maxLength={6}
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Multiple Pickup Locations */}
      <div className="grid gap-3">
        <Label className="font-semibold">Pickup Locations (Optional)</Label>

        {formData.pickupAddress.map((location, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={location}
              onChange={(e) => handlePickupLocationChange(index, e.target.value)}
              placeholder={`Pickup Location ${index + 1}`}
              disabled={loading}
            />
            {formData.pickupAddress.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removePickupLocation(index)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-fit flex items-center gap-2 mt-2"
          onClick={addPickupLocation}
          disabled={loading}
        >
          <PlusCircle className="h-4 w-4" /> Add Another Pickup Location
        </Button>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          className="bg-[#004A89] hover:bg-[#004A89]/90 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> {isEditMode ? "Updating..." : "Saving..."}
            </>
          ) : (
            isEditMode ? "Update Customer" : "Add Customer"
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddCustomerForm;