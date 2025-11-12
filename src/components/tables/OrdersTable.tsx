import axiosInstance from "@/services/axiosInstance";
import { useEffect, useState } from "react";
// shadcn components
import { Button } from "../ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// lucide icons
import {
  Package,
  RefreshCw,
  Info,
  AlertCircle,
  PackageCheck,
  Truck,
  Warehouse,
  MapPin,
  CheckCircle2,
  PackageX,
  RotateCcw
} from "lucide-react";
// other components
import { CommonTable, type ColumnDef } from "../commons/Table";
import { OrderData } from "../commons/types";

// import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { formatDate, } from "../commons/formatDate";
import { OrderTag } from "../commons/OrderTag";
import { PickupTag } from "../commons/PickupTag";


const isPickupDelayed = (order: OrderData) => {
  if (order.status !== "pending") return false; // only check for unpicked orders

  const createdAt = new Date(order.createdAt);
  const now = new Date();
  const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  return diffHours >= 24; // delayed if > 24h after order creation
};



// Order Details Dialog
const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Package className="w-5 h-5 text-gray-400" />;
    case "picked_up":
      return <PackageCheck className="w-5 h-5 text-blue-500" />;
    case "in_transit":
      return <Truck className="w-5 h-5 text-blue-600" />;
    case "arrived_hub":
      return <Warehouse className="w-5 h-5 text-blue-700" />;
    case "out_for_delivery":
      return <MapPin className="w-5 h-5 text-yellow-500" />;
    case "delivered":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "hold":
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
    case "cancelled":
      return <PackageX className="w-5 h-5 text-red-500" />;
    case "returned":
      return <RotateCcw className="w-5 h-5 text-purple-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-400" />;
  }
};

interface ShipmentHistoryEvent {
  status: string;
  remarks: string;
  location: string;
  timestamp: string;
  updatedAt: string;
}


// Define ShipmentHistory component once
const ShipmentHistory = ({ history }: { history: ShipmentHistoryEvent[] }) => (
  <ul className="space-y-6">
    {history.map((event, idx) => (
      <li key={idx} className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getStatusIcon(event.status)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {event.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </p>
          <p className="text-sm text-gray-600">{event.remarks}</p>
          <p className="text-xs text-gray-500 mt-1">
            {event.location} • {formatDate(event.updatedAt)}
          </p>
        </div>
      </li>
    ))}
  </ul>
);

// Order Details Dialog
const OrderDetailsDialog = ({ order }: { order: OrderData }) => {
  const [history, setHistory] = useState<ShipmentHistoryEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  // Move fetchHistory outside of useEffect

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state when retrying
      const res = await axiosInstance.get(`/api/shipments/${order.id}/history`);
      setHistory(res.data.history || []); // Add fallback empty array
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load shipment history');
      toast.error('Failed to load shipment history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [order.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-800"
        >
          <Info className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Order Details - {order.tracking_number}
          </DialogTitle>
        </DialogHeader>
        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Tracking Number</p>
            <p className="text-gray-900">{order.tracking_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Customer Reference No</p>
            <p className="text-gray-900">{order.customer_reference_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Order Created Date</p>
            <p className="text-gray-900">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Pickup Date</p>
            <p className="text-gray-900">{formatDate(order.pickup_date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Expected Delivery Date</p>
            <p className="text-gray-900">{order.expected_delivery_date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Origin</p>
            <p className="text-gray-900">{order.origin}</p>
          </div>


          <div>
            <p className="text-sm font-medium text-gray-600">Destination</p>
            <p className="text-gray-900">{order.destination}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Package Type</p>
            <p className="text-gray-900">{order.package_type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Parcel Content Description</p>
            <p className="text-gray-900">{order.parcel_content_description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Payment Status</p>
            <p className="text-gray-900">{order.payment_status}</p>
          </div>

          {/* <div>
          <p className="text-sm font-medium text-gray-600">Email</p>
          <p className="text-gray-900">{order.customerEmail}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Phone</p>
          <p className="text-gray-900">{order.customerPhone}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Courier</p>
          <p className="text-gray-900">{order.courier}</p>
        </div> */}

          <div>
            <p className="text-sm font-medium text-gray-600">Delivery Date</p>
            <p className="text-gray-900">
              {order.deliveryDate ? order.deliveryDate : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-gray-900 capitalize">{order.status}</p>
          </div>


        </div>

        {/* Shipment History Section */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Shipment History</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchHistory()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : (
            <ShipmentHistory history={history} />
          )}
        </div>

      </DialogContent>
    </Dialog>
  )

};

type OrderTableProps = {
  userRole: string;
  orders: OrderData[];
  status: "pending" | "picked_up" | "in_transit" | "arrived_hub" | "out_for_delivery" | "delivered" | "hold" | "cancelled" | "returned";
  error: string | null;
  loading: boolean;
  onRetry: () => void;
  deliveryAgents: { id: number; firstName: string; lastName: string }[];
  onAssign?: (orderId: number, agentId: number) => Promise<void>;
  onStatusUpdated?: () => void;
  onOrdersLoaded: () => void;
  refreshTrigger?: boolean;
};

export default function OrderTable({
  orders,
  status,
  error,
  loading,
  onRetry,
  deliveryAgents,
  onAssign,
  onStatusUpdated,
  userRole,
}: OrderTableProps) {
  const [assigning, setAssigning] = useState<number | null>(null);
  const filteredOrders = orders.filter((o) => o.status === status);

  // const { getToken } = useAuth();

  const StatusUpdater = ({
    row,
    userRole,
    onStatusUpdated,
  }: {
    row: OrderData;
    userRole: string;
    onStatusUpdated?: () => void;
  }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [location, setLocation] = useState("");
    const [remarks, setRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const statusColors: Record<OrderData["status"], string> = {
      pending: "bg-orange-500 text-white",
      picked_up: "bg-yellow-500 text-white",
      in_transit: "bg-blue-500 text-white",
      arrived_hub: "bg-indigo-500 text-white",
      out_for_delivery: "bg-cyan-500 text-white",
      delivered: "bg-green-500 text-white",
      hold: "bg-gray-500 text-white",
      cancelled: "bg-red-700 text-white",
      returned: "bg-purple-500 text-white",
    };

    const allowedNextStatuses: Record<string, string[]> = {
      pending: ["picked_up", "cancelled"],
      picked_up: ["in_transit", "hold", "cancelled"],
      in_transit: ["arrived_hub", "out_for_delivery", "hold", "returned"],
      arrived_hub: ["in_transit", "out_for_delivery", "hold"],
      out_for_delivery: ["delivered", "hold", "returned"],
      hold: ["in_transit", "out_for_delivery", "cancelled"],
      delivered: [],
      cancelled: [],
      returned: [],
    };

    const nextOptions = allowedNextStatuses[row.status] || [];

    const handleSubmitStatus = async () => {
      if (!selectedStatus || !location.trim() || !remarks.trim()) {
        toast.error("Location and remarks are required fields.");
        return;
      }
      try {
        setSubmitting(true);
        await axiosInstance.post(`/api/shipments/${row.id}/status`, {
          status: selectedStatus,
          location,
          remarks,
        });
        toast.success(`Status updated to ${selectedStatus.replace("_", " ")}`);
        setOpenDialog(false);
        setLocation("");
        setRemarks("");
        onStatusUpdated?.();
      } catch (err) {
        console.error("Failed to update status:", err);
        toast.error("Failed to update status");
      } finally {
        setSubmitting(false);
      }
    };

   

    return (
      <div className="flex items-center gap-2">
        <span className={`capitalize px-2 py-1 text-xs rounded ${statusColors[row.status]}`}>
          {row.status.replace("_", " ")}
        </span>

        {(userRole === "delivery_agent" || userRole === "admin" || userRole === "sub_admin") && nextOptions.length > 0 && (
          <>
            <Select
              defaultValue=""
              onValueChange={(value) => {
                setSelectedStatus(value);
                setOpenDialog(true);
              }}
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {nextOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dialog for Location + Remarks */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Update Status – {selectedStatus.replace("_", " ")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 mt-3">
                  <div>
                    <label className="text-sm font-medium">Current Location</label>
                    <input
                      type="text"
                      placeholder="Enter current location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Remarks</label>
                    <textarea
                      placeholder="Add remarks (required)"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1 h-20 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-5">
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={submitting}
                    onClick={handleSubmitStatus}
                    className="bg-blue-600 text-white"
                  >
                    {submitting ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    );
  };

   const handleAssign = async (orderId: number, agentId: number) => {
      try {
        setAssigning(orderId);
        await onAssign?.(orderId, agentId);
        toast.success("Agent assigned successfully");
      } catch (err) {
        console.error("Failed to assign agent:", err);
        toast.error("Failed to assign agent");
      } finally {
        setAssigning(null);
      }
    };


  // Table Columns
  const columns: ColumnDef<OrderData>[] = [
    // Only add the column when the user is a delivery_agent
    ...(userRole === "delivery_agent"
      ? [
        {
          key: "orderType" as keyof OrderData, // ✅ type-safe cast
          label: "Order Type",
          render: (row: OrderData) => (
            <OrderTag
              type={row?.orderType === "assigned" ? "assigned" : "city-based"}
            />
          ),
        },
      ]
      : []),

    {
      key: "pickup_status",
      label: "Pickup Status",
      render: (row) => {

        const delayed = isPickupDelayed(row);
        const tagType = delayed ? "delayed" : "on-time";
        return <PickupTag type={tagType} />;
      },
    },


    {
      key: "tracking_number",
      label: "Tracking No",
      render: (row) => <div className="font-medium">{row.tracking_number}</div>,
    },
    {
      key: "customer_reference_number",
      label: "Cutomer Ref No",
      render: (row) => <span>{row.customer_reference_number}</span>,
    },
    {
      key: "createdAt",
      label: "Order Date",
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
    },
    {
      key: "pickup_date",
      label: "Pickup Date",
      render: (row) => <span>{row.pickup_date}</span>,
    },
    {
      key: "expected_delivery_date",
      label: "Expected Delivery Date",
      render: (row) => <span>{row.expected_delivery_date}</span>,
    },
    {
      key: "origin",
      label: "Origin",
      render: (row) => <span>{row.origin}</span>,
    },
    {
      key: "destination",
      label: "Destination",
      render: (row) => <span>{row.destination}</span>,
    },
    {
      key: "package_type",
      label: "Package Type",
      render: (row) => <span>{row.package_type}</span>,
    },
    {
      key: "parcel_content_description",
      label: "Parcel Content Description",
      render: (row) => <span>{row.parcel_content_description}</span>,
    },
    {
      key: "payment_status",
      label: "Payment Mode",
      render: (row) => <span>{row.payment_status}</span>,
    },
    {
      key: "info",
      label: "Info",
      render: (row) => <OrderDetailsDialog order={row} />,
    },
    {
      key: "assign_agent",
      label: "Assign Agent",
      render: (row) =>
        userRole === "admin" || userRole === "sub_admin" ? (
          <Select
            defaultValue={row.deliveryAgent?.id?.toString() || ""}
            disabled={assigning === row.id}
            onValueChange={(value) => handleAssign(row.id, Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              {deliveryAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id.toString()}>
                  {agent.firstName + " " + agent.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-gray-500 text-sm">N/A</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusUpdater
          row={row}
          userRole={userRole}
          onStatusUpdated={onStatusUpdated}
        />
      ),
    },
  ];


  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <p className="text-red-600 font-medium">{error}</p>
        <Button onClick={onRetry} className="mt-3 bg-red-500 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!loading && filteredOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Package className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-600 text-lg font-medium">
          No {status.replace("_", " ")} orders
        </p>
        <p className="text-gray-500">Check back later or refresh.</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5">
      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading...</p>
      ) : (
        <CommonTable data={filteredOrders} columns={columns} userRole={userRole} />
      )}
    </div>
  );
}


/*

🚚 Shipment Status Flow — Example: Mumbai → Delhi (Sultanpur Hub)
Status	         | Sample Location (City / Area)	 | Example Remarks (What Agent Should Write)	               | Purpose / Meaning
pending	         | Auto-set by system	             | Pickup requested by customer	                             | Order created but not yet handled by agent
picked_up        | Mumbai - Andheri East	         | Parcel picked up from sender’s address	                   | Confirms collection from customer
in_transit       | Mumbai - Express Cargo Terminal | Shipment departed from Mumbai and on the way to Delhi hub | Confirms it’s now in movement toward destination
arrived_hub      | Sultanpur Hub (Delhi NCR)	     | Shipment reached central hub for sorting	                 | Confirms parcel reached sorting/distribution center
out_for_delivery | Delhi - Lajpat Nagar 	         | Shipment out for delivery to recipient	                   | Confirms it’s now with the delivery agent for last mile
delivered	       | Delhi - Lajpat Nagar	           | Delivered to recipient - signed by Mr. Rahul Verma	       | Confirms final handover completion
hold	           | Sultanpur Hub	                 | Delivery delayed due to address verification issue	       | Temporarily stopped (address / payment / weather / etc.)
cancelled	       | Mumbai - Andheri East	         | Shipment cancelled by sender before pickup	               | Shipment stopped before dispatch
returned	       | Delhi - Lajpat Nagar	           | Recipient not available, shipment returned to origin	     |Returned back to sender or warehouse
*/