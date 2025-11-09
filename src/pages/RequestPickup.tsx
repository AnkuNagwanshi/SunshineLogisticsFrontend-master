import axiosInstance from '@/services/axiosInstance';
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import axios from 'axios';

interface Order {
    id: number;
    customer_id: number;
    tracking_number: string;
    //awb_number: string;
    customer_reference_number:string;
    invoice_url: string;
    origin: string;
    destination: string;
    payment_method: string;
    payment_status: string;
    status: string;
}

interface PickupResponse {
    message: string;
    order: Order;
}

const RequestPickup = () => {

    const { getToken } = useAuth();


    const [formData, setFormData] = useState({
        // sender information
        sender_name: "",
        sender_phone: "",
        sender_address: "",
        // receiver information
        receiver_name: "",
        receiver_phone: "",
        receiver_address: "",
        // origin location details
        origin_country: "",
        origin_state: "",
        origin_city: "",
        // destination location details
        destination_country: "",
        destination_state: "",
        destination_city: "",
        // package details
        package_type: "",
        weight: "",
        dimensions: "",
        parcel_value: "",
        parcel_content_description: "",
        // payment details
        payment_method: "COD",
        payment_status: "unpaid", // default (you can add dropdown later)
    });

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<PickupResponse | { error: string } | null>(null);

    // const handleChange = (
    //     e: React.ChangeEvent<
    //         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    //     >
    // ) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    // };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        const token = getToken(); // 🧠 get customerToken from sessionStorage
        console.log("Customer Token:", token);

        try {
            const res = await axiosInstance.post<PickupResponse>("/api/orders/request-pickup", formData, {
                
            });
            console.log("request pickup response", res);
            setResponse(res.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data as { error?: string } | undefined;
                setResponse(
                    data?.error
                        ? { error: data.error }
                        : { error: "Something went wrong" }
                );
            } else {
                setResponse({ error: "Something went wrong" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto py-16 px-6">
            <h1 className="text-3xl font-bold mb-6">Request a Pickup</h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded-lg">
                <h2 className="font-semibold">Sender Details</h2>
                <input
                    name="sender_name"
                    placeholder="Sender Name"
                    value={formData.sender_name}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <input
                    name="sender_phone"
                    placeholder="Sender Phone"
                    value={formData.sender_phone}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <textarea
                    name="sender_address"
                    placeholder="Sender Address"
                    value={formData.sender_address}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />


                <h2 className="font-semibold">Receiver Details</h2>
                <input
                    name="receiver_name"
                    placeholder="Receiver Name"
                    value={formData.receiver_name}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="receiver_phone"
                    placeholder="Receiver Phone"
                    value={formData.receiver_phone}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <textarea
                    name="receiver_address"
                    placeholder="Receiver Address"
                    value={formData.receiver_address}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />


                <h2 className="font-semibold">Origin Location</h2>
                <input
                    name="origin_country"
                    placeholder="Country of Origin"
                    value={formData.origin_country}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <input
                    name="origin_state"
                    placeholder="State of Origin"
                    value={formData.origin_state}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="origin_city"
                    placeholder="City of Origin"
                    value={formData.origin_city}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <h2 className='font-semibold'>Destination Location</h2>
                <input
                    name="destination_country"
                    placeholder="Country of Destination"
                    value={formData.destination_country}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="destination_state"
                    placeholder="State of Destination"
                    value={formData.destination_state}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="destination_city"
                    placeholder="City of Destination"
                    value={formData.destination_city}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <h2 className="font-semibold">Package Details</h2>
                <input
                    name="package_type"
                    placeholder="Package Type"
                    value={formData.package_type}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="weight"
                    placeholder="Weight (kg)"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="dimensions"
                    placeholder="Dimensions (LxWxH)"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />
                <input
                    name="parcel_value"
                    placeholder="Parcel Value"
                    value={formData.parcel_value}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <input
                    name="parcel_content_description"
                    placeholder="Parcel Content Description"
                    value={formData.parcel_content_description}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                />

                <h2 className="font-semibold">Payment Method</h2>
                <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                >
                    <option value="">Select Payment Method</option>
                    <option value="COD">Cash on Delivery</option>
                    <option value="Prepaid">Prepaid</option>
                    <option value="Wallet">Wallet</option>
                    <option value="UPI">UPI</option>
                    <option value="CreditCard">Credit Card</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                    {loading ? "Submitting..." : "Submit Pickup Request"}
                </button>
            </form>

            {response && (
                <div className="mt-6 p-4 border rounded bg-gray-100">
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </section>
    );
};

export default RequestPickup;


// Request Pickup Data 

/*  
[
  {
    "sender_name": "Ravi Kumar",
    "sender_address": "45, Patel Nagar, Delhi ",
    "sender_phone": "9876543210",
    "receiver_name": "Anita Sharma",
    "receiver_address": "22, MG Road, Mumbai",
    "receiver_phone": "9988776655",
    "origin_country": "India",
    "origin_state": "Delhi",
    "origin_city": "New Delhi",
    "destination_country": "India",
    "destination_state": "Maharashtra",
    "destination_city": "Mumbai",
    "package_type": "Documents",
    "weight": "1.2",
    "dimensions": "30x20x5 cm",
    "parcel_value": "500",
    "parcel_content_description": "Business papers and invoices",
    "payment_method": "Prepaid"
  },
  {
    "sender_name": "Karan Mehta",
    "sender_address": "Sector 18, Noida, UP",
    "sender_phone": "9123456789",
    "receiver_name": "Sonal Verma",
    "receiver_address": "Flat 302, Green Heights, Pune",
    "receiver_phone": "9345678123",
    "origin_country": "India",
    "origin_state": "Uttar Pradesh",
    "origin_city": "Noida",
    "destination_country": "India",
    "destination_state": "Maharashtra",
    "destination_city": "Pune",
    "package_type": "Electronics",
    "weight": "2.8",
    "dimensions": "25x25x15 cm",
    "parcel_value": "3500",
    "parcel_content_description": "Bluetooth speaker and charger",
    "payment_method": "COD"
  },
  {
    "sender_name": "Sneha Patel",
    "sender_address": "Kalupur, Ahmedabad, Gujarat",
    "sender_phone": "8866554433",
    "receiver_name": "Rahul Nair",
    "receiver_address": "HSR Layout, Bengaluru",
    "receiver_phone": "9090909090",
    "origin_country": "India",
    "origin_state": "Gujarat",
    "origin_city": "Ahmedabad",
    "destination_country": "India",
    "destination_state": "Karnataka",
    "destination_city": "Bengaluru",
    "package_type": "Clothing",
    "weight": "3.0",
    "dimensions": "40x30x20 cm",
    "parcel_value": "1800",
    "parcel_content_description": "Designer sarees and dupatta",
    "payment_method": "Prepaid"
  },
  {
    "sender_name": "Arjun Singh",
    "sender_address": "Civil Lines, Kanpur, UP",
    "sender_phone": "9823456780",
    "receiver_name": "Deepak Sharma",
    "receiver_address": "DLF Phase 2, Gurugram",
    "receiver_phone": "9811122233",
    "origin_country": "India",
    "origin_state": "Uttar Pradesh",
    "origin_city": "Kanpur",
    "destination_country": "India",
    "destination_state": "Haryana",
    "destination_city": "Gurugram",
    "package_type": "Books",
    "weight": "4.2",
    "dimensions": "35x25x10 cm",
    "parcel_value": "900",
    "parcel_content_description": "Engineering books and notes",
    "payment_method": "Prepaid"
  },
  {
    "sender_name": "Mohit Jain",
    "sender_address": "Lal Bagh, Indore, MP",
    "sender_phone": "9844332211",
    "receiver_name": "Priya Das",
    "receiver_address": "Salt Lake, Kolkata",
    "receiver_phone": "9900332211",
    "origin_country": "India",
    "origin_state": "Madhya Pradesh",
    "origin_city": "Indore",
    "destination_country": "India",
    "destination_state": "West Bengal",
    "destination_city": "Kolkata",
    "package_type": "Gifts",
    "weight": "1.5",
    "dimensions": "20x20x10 cm",
    "parcel_value": "700",
    "parcel_content_description": "Gift box with chocolates & greeting card",
    "payment_method": "COD"
  },
  {
    "sender_name": "Tanya Kapoor",
    "sender_address": "Vasant Vihar, Delhi",
    "sender_phone": "9810012345",
    "receiver_name": "Rohit Verma",
    "receiver_address": "Ameerpet, Hyderabad",
    "receiver_phone": "9912345678",
    "origin_country": "India",
    "origin_state": "Delhi",
    "origin_city": "New Delhi",
    "destination_country": "India",
    "destination_state": "Telangana",
    "destination_city": "Hyderabad",
    "package_type": "Accessories",
    "weight": "0.9",
    "dimensions": "15x15x8 cm",
    "parcel_value": "1200",
    "parcel_content_description": "Wristwatch and keychain",
    "payment_method": "Prepaid"
  },
  {
    "sender_name": "Vikas Gupta",
    "sender_address": "Connaught Place, Delhi",
    "sender_phone": "9870067890",
    "receiver_name": "Pooja Yadav",
    "receiver_address": "Sector 62, Noida",
    "receiver_phone": "8754231212",
    "origin_country": "India",
    "origin_state": "Delhi",
    "origin_city": "New Delhi",
    "destination_country": "India",
    "destination_state": "Uttar Pradesh",
    "destination_city": "Noida",
    "package_type": "Documents",
    "weight": "0.6",
    "dimensions": "28x18x2 cm",
    "parcel_value": "250",
    "parcel_content_description": "Company legal documents",
    "payment_method": "Prepaid"
  },
  {
    "sender_name": "Harshita Reddy",
    "sender_address": "Banjara Hills, Hyderabad",
    "sender_phone": "9000001111",
    "receiver_name": "Neeraj Kumar",
    "receiver_address": "Koregaon Park, Pune",
    "receiver_phone": "9223344556",
    "origin_country": "India",
    "origin_state": "Telangana",
    "origin_city": "Hyderabad",
    "destination_country": "India",
    "destination_state": "Maharashtra",
    "destination_city": "Pune",
    "package_type": "Documents",
    "weight": "1.0",
    "dimensions": "25x20x5 cm",
    "parcel_value": "400",
    "parcel_content_description": "University application papers",
    "payment_method": "Prepaid"
  },
  {
    "sender_name": "Amit Tiwari",
    "sender_address": "Civil Lines, Lucknow",
    "sender_phone": "9888777665",
    "receiver_name": "Manisha Patel",
    "receiver_address": "Satellite, Ahmedabad",
    "receiver_phone": "9871123456",
    "origin_country": "India",
    "origin_state": "Uttar Pradesh",
    "origin_city": "Lucknow",
    "destination_country": "India",
    "destination_state": "Gujarat",
    "destination_city": "Ahmedabad",
    "package_type": "Pharmaceuticals",
    "weight": "2.0",
    "dimensions": "30x20x10 cm",
    "parcel_value": "2000",
    "parcel_content_description": "Medical samples and prescriptions",
    "payment_method": "COD"
  },
  {
    "sender_name": "Ritika Shah",
    "sender_address": "Andheri West, Mumbai",
    "sender_phone": "9001234567",
    "receiver_name": "Suresh Iyer",
    "receiver_address": "Mylapore, Chennai",
    "receiver_phone": "9822222222",
    "origin_country": "India",
    "origin_state": "Maharashtra",
    "origin_city": "Mumbai",
    "destination_country": "India",
    "destination_state": "Tamil Nadu",
    "destination_city": "Chennai",
    "package_type": "Household Items",
    "weight": "6.5",
    "dimensions": "50x40x30 cm",
    "parcel_value": "5000",
    "parcel_content_description": "Kitchen utensils and dinner set",
    "payment_method": "Prepaid"
  }
]
*/