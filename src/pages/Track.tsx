import React, { useState } from "react";
import axiosInstance from '@/services/axiosInstance';
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  Package,
  Truck,
  Warehouse,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PackageCheck,
  Loader,
  FileText
} from "lucide-react";

import { formatDate } from "@/components/commons/formatDate";


interface OrderStatus {
  id: number;
  tracking_number: string;
  //awb_number: string;
  customer_reference_number:string;
  invoice_url: string | null;
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  package_type: string;
  weight: number;
  dimensions: string;
  origin: string;
  destination: string;
  status: string;
  current_location: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  expected_delivery_date: string | null;
  shipping_cost: number | null;
  cod_amount: number | null;
  payment_status: string;
  delivery_signature: string | null;
  delivery_photo: string | null;
  delivery_agent_id: number;
  createdAt: string;
  updatedAt: string;
}

const steps = [
  {
    label: "Pending",
    icon: Package,
    color: "text-gray-400",
    description: "Order has been created"
  },
  {
    label: "Picked Up",
    icon: PackageCheck,
    color: "text-blue-500",
    description: "Package collected from sender"
  },
  {
    label: "In Transit",
    icon: Truck,
    color: "text-blue-600",
    description: "Package is on the way"
  },
  {
    label: "Arrived at Hub",
    icon: Warehouse,
    color: "text-blue-700",
    description: "Package reached distribution center"
  },
  {
    label: "Out for Delivery",
    icon: MapPin,
    color: "text-yellow-500",
    description: "Package is out for final delivery"
  },
  {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-green-500",
    description: "Package has been delivered"
  }
];

const shouldShowStatus = (currentStatus: string, checkStatus: string) => {
  const statusOrder = {
    "pending": 0,
    "picked_up": 1,
    "in_transit": 2,
    "arrived_hub": 3,
    "out_for_delivery": 4,
    "delivered": 5
  };

  return statusOrder[currentStatus as keyof typeof statusOrder] >= statusOrder[checkStatus as keyof typeof statusOrder];
};

const Track = () => {
  const [awbNumber, setAwbNumber] = useState("");
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { getToken } = useAuth();

  // Map status to step index
  const getStepIndex = (status: string): number => {
    const statusMap: { [key: string]: number } = {
      "pending": 0,
      "picked_up": 1,
      "in_transit": 2,
      "arrived_hub": 3,
      "out_for_delivery": 4,
      "delivered": 5,
      "hold": -1,
      "cancelled": -1,
      "returned": -1
    };
    return statusMap[status] ?? -1;
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awbNumber) return;

    setLoading(true);
    setError("");
    setOrder(null);

    const token = getToken();
    try {
      const res = await axiosInstance.get(`/api/orders/track/${awbNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("Access denied. You can only track your own orders.");
      } else if (error.response?.status === 404) {
        setError("Order not found");
      } else {
        setError("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  // const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toLocaleString() : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Track Your Shipment</h1>

      {/* Tracking Input */}
      <form
        onSubmit={handleTrack}
        className="flex w-full max-w-xl bg-white shadow rounded-lg overflow-hidden"
      >
        <input
          type="text"
          placeholder="Enter AWB / Tracking Number"
          value={awbNumber}
          onChange={(e) => setAwbNumber(e.target.value)}
          className="flex-grow px-4 py-3 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 hover:bg-blue-700"
        >
          Track
        </button>
      </form>

      {/* Loader */}
      {loading && (
        <div className="mt-6 text-blue-600 font-medium">Fetching details...</div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 text-red-500 font-medium">{error}</div>
      )}

      {/* Order Details */}
      {order && (
        <div className="mt-8 w-full max-w-3xl bg-white shadow rounded-lg p-6">
          {/* <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
            Shipment Details
            {order?.invoice_url && (
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}${order.invoice_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
               📄 View Invoice
              </a>
            )}
          </h2> */}

          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
            Shipment Details

            {order?.invoice_url ? (
              <a
                // Server invoice pdf url 
                href={`${import.meta.env.VITE_API_BASE_URL}${order.invoice_url}`}
                // Local invoice pdf url
                // href={`${order.invoice_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1"
              >
                <FileText className="w-4 h-4" /> View Invoice
              </a>
            ) : (
              <button
                disabled
                className="text-sm bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-not-allowed flex items-center gap-1"
                title="Invoice not yet generated"
              >
               <Loader className="w-4 h-4 animate-spin" />Generating PDF...
              </button>
            )}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><span className="font-medium">Customer REF No.:</span> {order.customer_reference_number}</p>
            <p><span className="font-medium">Tracking No:</span> {order.tracking_number}</p>
            {order.sender_name && <p><span className="font-medium">Sender:</span> {order.sender_name}</p>}
            {order.receiver_name && <p><span className="font-medium">Receiver:</span> {order.receiver_name}</p>}
            {order.origin && <p><span className="font-medium">Origin:</span> {order.origin}</p>}
            {order.destination && <p><span className="font-medium">Destination:</span> {order.destination}</p>}
            {order.weight && <p><span className="font-medium">Weight:</span> {order.weight} kg</p>}
            {order.package_type && <p><span className="font-medium">Package Type:</span> {order.package_type}</p>}
            <p><span className="font-medium">Status:</span> {order.status}</p>
            <p><span className="font-medium">Expected Delivery:</span> {formatDate(order.expected_delivery_date)}</p>
          </div>

          {/* Progress Bar */}
          {/* Progress Bar */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-6">Shipment Progress</h3>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/4 left-[7%] w-[86%] h-0.5 bg-gray-200 -translate-y-1/2" />

              {/* Active Progress Line */}
              <div
                className="absolute top-1/4 left-[7%] h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500"
                style={{
                  width: `${(getStepIndex(order.status) / (steps.length - 1)) * 86}%`,
                  backgroundColor: order.status === 'cancelled' ? '#EF4444' : undefined
                }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const activeIndex = getStepIndex(order.status);
                  const isActive = index <= activeIndex;
                  const isCancelled = order.status === "cancelled";
                  const isCurrentStep = index === activeIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={index} className="flex flex-col items-center">
                      {/* Icon Circle */}
                      <div
                        className={`
                w-14 h-14 rounded-full flex items-center justify-center
                transition-all duration-500 relative z-10
                ${isCurrentStep ? 'scale-110' : ''}
                ${isCancelled
                            ? 'bg-red-500 shadow-red-200'
                            : isActive
                              ? 'bg-blue-600 shadow-blue-200'
                              : 'bg-gray-200'
                          }
                ${isActive ? 'shadow-lg' : ''}
              `}
                      >
                        <StepIcon
                          className={`w-7 h-7 ${isActive ? 'text-white' : 'text-gray-400'
                            }`}
                        />
                      </div>

                      {/* Label */}
                      <div className="mt-3 mb-1">
                        <span className={`
                font-medium text-sm
                ${isCurrentStep ? 'text-blue-600' : 'text-gray-600'}
              `}>
                          {step.label}
                        </span>
                      </div>

                      {/* Description */}
                      <span className={`
              text-xs text-center max-w-[120px]
              ${isCurrentStep ? 'text-blue-600' : 'text-gray-400'}
            `}>
                        {step.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-12">
            <h3 className="text-lg font-medium mb-4">Tracking History</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Order Created</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                    {order.origin && ` • ${order.origin}`}
                  </div>
                </div>
              </div>

              {order.pickup_date && (
                <div className="flex items-start space-x-3">
                  <PackageCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Package Picked Up</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.pickup_date)}
                      {order.current_location && ` • ${order.current_location}`}
                    </div>
                  </div>
                </div>
              )}

              {shouldShowStatus(order.status, "in_transit") && (
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">In Transit</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.updatedAt)}
                      {order.current_location && ` • ${order.current_location}`}
                    </div>
                  </div>
                </div>
              )}
              {shouldShowStatus(order.status, "arrived_hub") && (
                <div className="flex items-start space-x-3">
                  <Warehouse className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Arrived at Distribution Hub</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.updatedAt)}
                      {order.current_location && ` • ${order.current_location}`}
                    </div>
                  </div>
                </div>
              )}

              {shouldShowStatus(order.status, "out_for_delivery") && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Out for Delivery</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.updatedAt)} • Estimated delivery by {formatDate(order.expected_delivery_date)}
                    </div>
                  </div>
                </div>
              )}

              {order.status === "delivered" && (
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Delivered Successfully</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.delivery_date)}
                      {order.current_location && ` • ${order.current_location}`}
                    </div>
                  </div>
                </div>
              )}

              {(order.status === "cancelled" || order.status === "hold" || order.status === "returned") && (
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
                    <div className="text-sm text-gray-500">{formatDate(order.updatedAt)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Track;
