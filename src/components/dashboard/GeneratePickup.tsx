import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import axiosInstance from "@/services/axiosInstance";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Customer {
  id: number;
  name: string;
  companyName: string;
  gstNumber: string;
  mobile: string;
  email: string;
  pickupAddress: string[];
}

interface PickupFormData {
  customer_id: string;
  pickup_location: string;
  customer_reference_number: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  receiver_email: string;
  destination_city: string;
  destination_state: string;
  destination_country: string;
  package_type: string;
  weight: string;
  dimensions: string;
  parcel_value: string;
  parcel_content_description: string;
}

export function GeneratePickupForm() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCustomers, setFetchingCustomers] = useState(true);
  
  const [formData, setFormData] = useState<PickupFormData>({
    customer_id: "",
    pickup_location: "",
    customer_reference_number: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    receiver_email: "",
    destination_city: "",
    destination_state: "",
    destination_country: "India",
    package_type: "",
    weight: "",
    dimensions: "",
    parcel_value: "",
    parcel_content_description: "",
  });

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setFetchingCustomers(true);
      const response = await axiosInstance.get("/api/add_customer");
      const customerData = response.data?.customers || response.data || [];
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setFetchingCustomers(false);
    }
  };

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id.toString() === customerId);
    setSelectedCustomer(customer || null);
    setFormData((prev) => ({
      ...prev,
      customer_id: customerId,
      pickup_location: "", // Reset pickup location when customer changes
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/orders/generate-pickup", {
        customer_id: parseInt(formData.customer_id),
        pickup_location: formData.pickup_location,
        customer_reference_number: formData.customer_reference_number || null,
        receiver_name: formData.receiver_name,
        receiver_phone: formData.receiver_phone,
        receiver_email: formData.receiver_email || null,
        receiver_address: formData.receiver_address,
        destination_city: formData.destination_city,
        destination_state: formData.destination_state,
        destination_country: formData.destination_country,
        package_type: formData.package_type || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        parcel_value: formData.parcel_value ? parseFloat(formData.parcel_value) : null,
        parcel_content_description: formData.parcel_content_description || null,
      });

      toast.success(
        `Pickup generated! Tracking: ${response.data.order.tracking_number}`
      );

      // Show tracking and customer ref in alert
      alert(
        `✅ Pickup Generated Successfully!

Tracking Number: ${response.data.order.tracking_number}
Customer Reference: ${response.data.order.customer_reference_number || "N/A"}`
      );

      // Reset form
      setFormData({
        customer_id: "",
        pickup_location: "",
        customer_reference_number: "",
        receiver_name: "",
        receiver_phone: "",
        receiver_address: "",
        receiver_email: "",
        destination_city: "",
        destination_state: "",
        destination_country: "India",
        package_type: "",
        weight: "",
        dimensions: "",
        parcel_value: "",
        parcel_content_description: "",
      });
      setSelectedCustomer(null);
    } catch (error: any) {
      console.error("Error generating pickup:", error);
      toast.error(error.response?.data?.error || "Failed to generate pickup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-blue-600 text-center">
        Generate Pickup / Order Create
      </h2>

      {/* Tracking & Customer Reference Section */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold mb-3 text-gray-700">Tracking Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tracking No</Label>
            <Input value="Auto-generated from database" disabled className="bg-gray-100" />
          </div>
          <div>
            <Label>Customer Reference No (Optional)</Label>
            <Input
              name="customer_reference_number"
              value={formData.customer_reference_number}
              onChange={handleChange}
              placeholder="Customer's own docket/reference number"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Can track order with tracking no or customer reference no
            </p>
          </div>
        </div>
      </div>

      {/* Sender Details / Pickup Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold mb-3 text-gray-700">Sender Details / Pickup</h3>
        
        {/* Customer Selection */}
        <div className="mb-4">
          <Label className="text-red-600">Customer Name *</Label>
          <Select
            value={formData.customer_id}
            onValueChange={handleCustomerSelect}
            disabled={loading || fetchingCustomers}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select customer and auto-fill details" />
            </SelectTrigger>
            <SelectContent>
              {fetchingCustomers ? (
                <SelectItem value="loading" disabled>
                  Loading customers...
                </SelectItem>
              ) : customers.length === 0 ? (
                <SelectItem value="no-customers" disabled>
                  No customers found
                </SelectItem>
              ) : (
                customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name} - {customer.companyName || "N/A"}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Auto-filled Customer Details */}
        {selectedCustomer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input value={selectedCustomer.companyName || "N/A"} disabled className="bg-gray-100" />
            </div>
            <div>
              <Label>GST No</Label>
              <Input value={selectedCustomer.gstNumber || "N/A"} disabled className="bg-gray-100" />
            </div>
            <div>
              <Label>Mobile No</Label>
              <Input value={selectedCustomer.mobile || "N/A"} disabled className="bg-gray-100" />
            </div>
            <div>
              <Label>Email ID</Label>
              <Input value={selectedCustomer.email || "N/A"} disabled className="bg-gray-100" />
            </div>
          </div>
        )}

        {/* Pickup Location - Highlighted */}
        <div className="mt-4 bg-yellow-100 p-3 rounded border-2 border-yellow-400">
          <Label className="text-red-600 font-semibold">Pickup Location *</Label>
          <Select
            value={formData.pickup_location}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, pickup_location: value }))
            }
            disabled={!selectedCustomer || loading}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select from customer form pickup location" />
            </SelectTrigger>
            <SelectContent>
              {selectedCustomer?.pickupAddress && selectedCustomer.pickupAddress.length > 0 ? (
                selectedCustomer.pickupAddress.map((location, index) => (
                  <SelectItem key={index} value={location}>
                    {location}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-locations" disabled>
                  No pickup locations available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Receiver Details / Delivery Section */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-semibold mb-3 text-gray-700">Receiver Details / Delivery</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-red-600">Customer Name *</Label>
            <Input
              name="receiver_name"
              value={formData.receiver_name}
              onChange={handleChange}
              placeholder="Mandatory"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label>Company Name</Label>
            <Input
              placeholder="Not mandatory"
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-red-600">Mobile No *</Label>
            <Input
              name="receiver_phone"
              value={formData.receiver_phone}
              onChange={handleChange}
              placeholder="Mandatory"
              required
              pattern="[0-9]{10}"
              disabled={loading}
            />
          </div>
          <div>
            <Label>Email ID</Label>
            <Input
              name="receiver_email"
              value={formData.receiver_email}
              onChange={handleChange}
              type="email"
              placeholder="Not mandatory"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-red-600">Address / Location *</Label>
            <Input
              name="receiver_address"
              value={formData.receiver_address}
              onChange={handleChange}
              placeholder="Mandatory"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-red-600">Destination City *</Label>
            <Input
              name="destination_city"
              value={formData.destination_city}
              onChange={handleChange}
              placeholder="City"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-red-600">Destination State *</Label>
            <Input
              name="destination_state"
              value={formData.destination_state}
              onChange={handleChange}
              placeholder="State"
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Package Details Section */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-semibold mb-3 text-gray-700">Package Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Package Type</Label>
            <Input
              name="package_type"
              value={formData.package_type}
              onChange={handleChange}
              placeholder="Not mandatory (e.g., Box, Envelope)"
              disabled={loading}
            />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              type="number"
              step="0.01"
              placeholder="Not mandatory"
              disabled={loading}
            />
          </div>
          <div>
            <Label>Dimension (L x W x H cm)</Label>
            <Input
              name="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              placeholder="Not mandatory (e.g., 20x20x20)"
              disabled={loading}
            />
          </div>
          <div>
            <Label>Parcel Value (₹)</Label>
            <Input
              name="parcel_value"
              value={formData.parcel_value}
              onChange={handleChange}
              type="number"
              step="0.01"
              placeholder="Not mandatory"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Parcel Content Description</Label>
            <Input
              name="parcel_content_description"
              value={formData.parcel_content_description}
              onChange={handleChange}
              placeholder="Not mandatory (e.g., Electronics, Clothes)"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          className="bg-[#004A89] hover:bg-[#004A89]/90 text-white px-8"
          disabled={loading || !selectedCustomer || !formData.pickup_location}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating Pickup...
            </>
          ) : (
            "Generate Pickup"
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500">
        * All information will print in PDF
      </p>
    </form>
  );
}

export default GeneratePickupForm;
