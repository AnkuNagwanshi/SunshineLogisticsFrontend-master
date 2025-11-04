import axiosInstance from "@/services/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// lucide icons
import { Package, Truck, CheckCircle, XCircle, RefreshCw, Clock, MapPinned, House, TruckElectric, CornerDownLeft } from "lucide-react";
// other project components
import { OrderData } from "../commons/types";
import OrderTable from "../tables/OrdersTable";
// auth context
import { useAuth } from "@/context/AuthContext";


interface DeliveryAgent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
}

type OrderStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "arrived_hub"
  | "out_for_delivery"
  | "delivered"
  | "hold"
  | "cancelled"
  | "returned";

export default function CreateOrders() {

  const [counts, setCounts] = useState<Record<OrderStatus, number>>({
    pending: 0,
    picked_up: 0,
    in_transit: 0,
    arrived_hub: 0,
    out_for_delivery: 0,
    delivered: 0,
    hold: 0,
    cancelled: 0,
    returned: 0,
  });

  const tabContent: OrderStatus[] = [
    "pending", "picked_up", "in_transit", "arrived_hub",
    "out_for_delivery", "delivered", "hold", "cancelled", "returned"
  ];

  const statisticsCards = [
    {
      title: "Pending Orders",
      count: counts.pending,
      description: "Awaiting approval",
      icon: Clock,
      color: "orange",
      key: "pending"
    },
    {
      title: "Picked Up Orders",
      count: counts.picked_up,
      description: "Pick Up",
      icon: MapPinned,
      color: "orange",
      key: "picked_up"
    },
    {
      title: "In Transit",
      count: counts.in_transit,
      description: "On the way",
      icon: Truck,
      color: "blue",
      key: "in_transit"
    },
    {
      title: "Arrived Hub",
      count: counts.arrived_hub,
      description: "Order arrived at hub",
      icon: House,
      color: "blue",
      key: "arrived_hub"
    },
    {
      title: "Out For Delivery",
      count: counts.out_for_delivery,
      description: "Order is out for delivery",
      icon: TruckElectric,
      color: "green",
      key: "out_for_delivery"
    },
    {
      title: "Delivered",
      count: counts.delivered,
      description: "Successfully delivered",
      icon: CheckCircle,
      color: "green",
      key: "delivered"
    },
    {
      title: "Hold",
      count: counts.hold,
      description: "Order on hold",
      icon: CheckCircle,
      color: "green",
      key: "hold"
    },
    {
      title: "Cancelled",
      count: counts.cancelled,
      description: "Orders cancelled",
      icon: XCircle,
      color: "red",
      key: "cancelled"
    },
    {
      title: "Returned",
      count: counts.returned,
      description: "Orders Returned",
      icon: CornerDownLeft,
      color: "red",
      key: "returned"
    }
  ];

  // const tabItems = [
  //   {
  //     value: "pending",
  //     icon: Truck,
  //     label: "Pending",
  //     count: counts.pending,
  //     bgColor: "bg-red-500"
  //   },
  //   {
  //     value: "picked_up",
  //     icon: MapPinned,
  //     label: "Picked Up",
  //     count: counts.picked_up,
  //     bgColor: "bg-orange-500"
  //   },
  //   {
  //     value: "in_transit",
  //     icon: Truck,
  //     label: "In Transit",
  //     count: counts.in_transit,
  //     bgColor: "bg-blue-500"
  //   },
  //   {
  //     value: "arrived_hub",
  //     icon: House,
  //     label: "Arrived Hub",
  //     count: counts.arrived_hub,
  //     bgColor: "bg-blue-500"
  //   },
  //   {
  //     value: "out_for_delivery",
  //     icon: TruckElectric,
  //     label: "Out for Delivery",
  //     count: counts.out_for_delivery,
  //     bgColor: "bg-green-500"
  //   },
  //   {
  //     value: "delivered",
  //     icon: CheckCircle,
  //     label: "Delivered",
  //     count: counts.delivered,
  //     bgColor: "bg-green-500"
  //   },
  //   {
  //     value: "hold",
  //     icon: CheckCircle,
  //     label: "Hold",
  //     count: counts.hold,
  //     bgColor: "bg-green-500"
  //   },
  //   {
  //     value: "cancelled",
  //     icon: XCircle,
  //     label: "Cancelled",
  //     count: counts.cancelled,
  //     bgColor: "bg-red-500"
  //   },
  //   {
  //     value: "returned",
  //     icon: CornerDownLeft,
  //     label: "Returned",
  //     count: counts.returned,
  //     bgColor: "bg-red-500"
  //   }
  // ];

  const tabItems = statisticsCards.map(card => ({
    value: card.key as OrderStatus,
    icon: card.icon,
    label: card.title.split(" ")[0],
    count: card.count,
    bgColor:
      card.color === "red" ? "bg-red-500" :
      card.color === "blue" ? "bg-blue-500" :
      card.color === "green" ? "bg-green-500" :
      "bg-orange-500"
  }));

  type TabValue = typeof tabItems[number]['value'];
  const [tab, setTab] = useState<TabValue>("pending");
  //  const [tab, setTab] = useState<OrderStatus>("pending");
  // const [tab, setTab] = useState<"pending" | "in_transit" | "delivered" | "cancelled">("pending");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { user } = useAuth();
  const userRole = user?.role ?? "";
  // console.log('userRole from orders - ', userRole)

  useEffect(() => {
    const activeTab = document.querySelector('[data-state="active"]');
    activeTab?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [tab]);
  // Fetch Orders + Delivery Agents
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let res;

      // Admin fetches all orders
      if (userRole === "admin") {
        res = await axiosInstance.get("/api/orders", {
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      // Delivery Agent fetches only assigned orders
      else if (userRole === "delivery_agent") {
        res = await axiosInstance.get("/api/orders/assigned-orders", {
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        setError("You are not authorized to view orders.");
        return;
      }

      const ordersData: OrderData[] = res.data.orders ?? [];
      const agentsData: DeliveryAgent[] = res.data.deliveryAgents ?? [];

      setOrders(ordersData);
      setDeliveryAgents(agentsData);

      // Count per status
      const newCounts = { pending: 0, picked_up: 0, in_transit: 0, arrived_hub: 0, out_for_delivery: 0, delivered: 0, hold: 0, cancelled: 0, returned: 0 };
      ordersData.forEach((o) => {
        if (newCounts[o.status] !== undefined) newCounts[o.status]++;
      });
      setCounts(newCounts);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isRefreshing]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Assign delivery agent to order
 const assignAgent = async (orderId: number, agentId: number) => {
    try {
      const res = await axiosInstance.put(`/api/orders/${orderId}/assign-agent`, {
        delivery_agent_id: agentId,
      });

      if (res.status === 200) {
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  delivery_agent_id: agentId,
                  deliveryAgent: deliveryAgents.find(a => a.id === agentId) ?? null,
                }
              : o
          )
        );
        toast.success("Assigned delivery agent successfully!");
      } else {
        toast.error("Failed to assign delivery agent.");
      }
    } catch (err) {
      console.error("Failed to assign agent", err);
      toast.error("Failed to assign delivery agent. Try again.");
    }
  };

  return (
    <div className="bg-gray-50 p-3 sm:p-5 md:p-6 lg:p-6">
      <div>
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {statisticsCards.map((card) => (
            <div key={card.key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-3xl font-bold text-${card.color}-600 mt-1`}>{card.count}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-700 text-xl font-medium mb-2">Loading orders...</p>
              <p className="text-gray-500 text-sm">Please wait while we fetch the order data</p>
            </div>
          ) : (
            <Tabs
              defaultValue="pending"
              value={tab}
              onValueChange={(val) => setTab(val as TabValue)}
              className="h-full flex flex-col p-2"
            >
              {/* original Tab Header */}
              {/* <div className="border-b border-gray-200 pt-2 pb-3">
                <TabsList>
                  {tabItems.map((item) => (
                    <TabsTrigger key={item.value} value={item.value}>
                      <item.icon className="w-4 h-4 mr-1" /> {item.label}
                      <span className={`${item.bgColor} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}>
                        {item.count}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div> */}

              {/* Tab Header | Perfect */}
              <div className="border-b border-gray-200 pt-2 pb-3 overflow-x-auto">
                <TabsList className="flex w-max min-w-full gap-2 px-2 sm:px-4">
                  {tabItems.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                    >
                      <item.icon className="w-4 h-4" /> {item.label}
                      <span
                        className={`${item.bgColor} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}
                      >
                        {item.count}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* <div className="border-b border-gray-200 p-2">
                <TabsList className="w-full h-auto mx-auto grid grid-cols-9 gap-1">
                  {tabItems.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="flex flex-col items-center justify-center py-2 px-1 text-xs whitespace-nowrap"
                    >
                      <item.icon className="w-4 h-4 mb-1" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className={`${item.bgColor} text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs px-1 mt-1`}>
                        {item.count}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div> */}


              {/* Tab Content */}
              <div className="flex-1">
                {tabContent.map((status) => (
                  <TabsContent key={status} value={status} className="h-full m-0">
                    <OrderTable
                      userRole={userRole}
                      error={error}
                      loading={loading}
                      status={status as OrderStatus}
                      refreshTrigger={isRefreshing}
                      onOrdersLoaded={() => { }}
                      orders={orders.filter((o) => o.status === status)}
                      deliveryAgents={deliveryAgents}
                      onAssign={assignAgent}
                      onStatusUpdated={fetchOrders}
                      onRetry={fetchOrders} 
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
