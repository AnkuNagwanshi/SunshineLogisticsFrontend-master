export type DeliveryAgentBasic = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
};

// ✅ Order Data Interface
export type OrderData = {
  id: number;
  pickup_status?: "picked-up on time" | "picked-up delayed";
  orderType?: "assigned" | "city-based";
  delivery_agent_id?: number;
  tracking_number: string;
  //awb_number: string;
  customer_reference_number:string;
  createdAt: string;
  pickup_date: string;
  expected_delivery_date: string;
  package_type: string;
  parcel_content_description: string;
  payment_status: string;
  info: string;
  assign_agent: string;
  origin: string;
  destination: string;
  status:
    | "pending"
    | "picked_up"
    | "in_transit"
    | "arrived_hub"
    | "out_for_delivery"
    | "delivered"
    | "hold"
    | "cancelled"
    | "returned";

  customerName: string;
  customerEmail: string;
  customerPhone: string;
  courier: string;

  deliveryDate?: string | null;
  deliveryAgentId?: number | null;
  deliveryAgent?: DeliveryAgentBasic | null;
};

// src/types/agent.ts
export interface AgentData {
  id: number;
  // avatar?: string | File | null;
  avatar?: string | File | null; // URL path from backend (e.g. "/uploads/agent-avatars/xxx.jpg")
  firstName: string;
  lastName: string;
  // compnayName:string | null;
  mobile: string;
  email: string;
  // address?:string | null;
  country: string;
  state: string;
  city: string;
  cityPincode: string;
  password?: string;
  role: string;
  info?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentFormData {
  id?: number;
  avatar?: string | File | null;
  firstName: string;
  lastName: string;
  // compnayName?:string | null;
  mobile: string;
  email: string;
  // address?:string | null;
  country: string;
  state: string;
  city: string;
  cityPincode: string;
  password?: string;
}
