import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axiosInstance from '../../services/axiosInstance'
// lucid icons
import { RefreshCw, Users, AlertCircle, Loader2, } from 'lucide-react'
// shadcn ui components
import { Button } from '../ui/button'
// configs

// other components
import { DeliveryAgentForm } from '../forms/DeliveryAgentForm'
import { DeliveryAgentTable } from '../tables/DeliveryAgentTable'

import { AgentData, AgentFormData } from '../commons/types'

// export interface AgentFormData {
//   avatar?: File | null
//   firstName: string;
//   lastName: string;
//   // compnayName:string;
//   mobile: string;
//   email: string;
//   // address:string;
//   country: string;
//   state: string;
//   city: string;
//   cityPincode: string;
//   password?: string;
// }

// interface AgentData {
//   id: number
//   firstName: string
//   lastName: string
//   // compnayName:string;
//   mobile: string;
//   email: string;
//   // address:string;
//   country: string;
//   state: string;
//   city: string;
//   cityPincode: string;
//   password: string
//   role: string
//   avatar?: string | null
// }

export default function DeliveryAgent() {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AgentData | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all delivery agents
  const getAgents = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await axiosInstance.get<AgentData[]>(`${import.meta.env.VITE_API_BASE_URL}/api/delivery-agents`)
      const responseData = Array.isArray(response.data) ? response.data : []

      const mappedAgents = responseData.map((agent) => ({
        // id: agent.id,
        // firstName: agent.firstName,
        // lastName: agent.lastName,
        // // companyName: agent.companyName,
        // mobile: agent.mobile,
        // email: agent.email,
        // // address: agent.address,
        // country: agent.country,
        // state: agent.state,
        // city: agent.city,
        // cityPincode: agent.cityPincode,
        // role: agent.role,
        ...agent,
        avatar: agent.avatar ? `${import.meta.env.VITE_API_BASE_URL}${agent.avatar}` : null,
        // password: agent.password || null,
      }));

      setAgents(mappedAgents);

    } catch (err) {
      console.error('Error fetching delivery agents:', err)
      setError('Failed to load delivery agents.')
      toast.error('Failed to load delivery agents.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    getAgents()
  }, []);


  // Add new agent (FormData handled here)
  const handleAddAgent = async (data: AgentFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      // formData.append("compnayName", data.compnayName);
      formData.append("mobile", data.mobile);
      formData.append("email", data.email);
      // formData.append("address", data.address);
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("cityPincode", data.cityPincode);
      if (data.password) formData.append("password", data.password);
      if (data.avatar) formData.append("avatar", data.avatar);
      // if (data.companyName) formData.append("companyName", data.companyName);
      // if (data.address) formData.append("address", data.address);

      const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/api/delivery-agents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // const created = response.data?.user ?? response.data;
      // if (!created) throw new Error("Invalid response from server");

      const newAgent: AgentData = {
        id: response.data.user.id,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        // companyName: response.data.user.compnayName,
        mobile: response.data.user.mobile,
        email: response.data.user.email,
        // address: response.data.user.address,
        country: response.data.user.country,
        state: response.data.user.state,
        city: response.data.user.city,
        cityPincode: response.data.user.cityPincode,
        password: response.data.user.password || '',
        role: response.data.user.role,
        avatar: response.data.user.avatar
          ? `${import.meta.env.VITE_API_BASE_URL}${response.data.user.avatar}`
          : null,
        createdAt: response.data.user.createdAt,
        updatedAt: response.data.user.updatedAt,
      };

      setAgents((prev) => [...prev, newAgent]);
      toast.success("Delivery agent added successfully!");
      setIsAddOpen(false);
    } catch (err) {
      console.error("Error adding agent:", err);
      toast.error("Failed to add delivery agent.");
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleUpdateAgent = async (data: AgentFormData) => {
    if (!selectedAgent) return
    setIsSubmitting(true)
    try {

      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      // formData.append("compnayName", data.compnayName);
      formData.append("mobile", data.mobile);
      formData.append("email", data.email);
      // formData.append("address", data.address);
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("city", data.city);
      formData.append("cityPincode", data.cityPincode);
      if (data.password) formData.append("password", data.password);
      if (data.avatar instanceof File) formData.append("avatar", data.avatar);
      // if (data.companyName) formData.append("companyName", data.companyName);
      // if (data.address) formData.append("address", data.address);

      const response = await axiosInstance.put(`${import.meta.env.VITE_API_BASE_URL}/api/delivery-agents/${selectedAgent.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const updated = response.data?.agent ?? response.data;
      if (!updated) throw new Error('Invalid response from server');

      const updatedAgent: AgentData = {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        // compnayName: updated.compnayName,
        mobile: updated.mobile,
        email: updated.email,
        // address: updated.address,
        country: updated.country,
        state: updated.state,
        city: updated.city,
        cityPincode: updated.cityPincode,
        role: updated.role,
        avatar: updated.avatar
          ? `${import.meta.env.VITE_API_BASE_URL}${updated.avatar}`
          : null,
        password: updated.password || "",
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };

      // Update state
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === selectedAgent.id ? updatedAgent : agent
        )
      );
      toast.success('Delivery agent updated successfully!')
      setIsUpdateOpen(false)
      setSelectedAgent(undefined)
    } catch (err) {
      console.error('Error updating agent:', err)
      toast.error('Failed to update delivery agent.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAgent = async (agentId: number) => {
    try {
      await axiosInstance.delete(`${import.meta.env.VITE_API_BASE_URL}/api/delivery-agents/${agentId}`)
      setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
      toast.success('Delivery agent deleted successfully!')
    } catch (err) {
      console.error('Error deleting agent:', err)
      toast.error('Failed to delete delivery agent.')
      // const msg =
      //   error?.response?.data?.message || "Failed to delete delivery agent.";
      // toast.error(msg);
    }
  }

  // Open edit modal with agent data
  const handleEditAgent = (agent: AgentData) => {
    setSelectedAgent(agent)
    setIsUpdateOpen(true)
  }

  // Close update modal
  const handleCloseUpdateModal = () => {
    setIsUpdateOpen(false)
    setTimeout(() => setSelectedAgent(undefined), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 backdrop-blur-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Agents</h1>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => getAgents(true)} variant="outline" disabled={isLoading || isRefreshing}>
            {isRefreshing ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
            Refresh
          </Button>
          <Button onClick={() => setIsAddOpen(true)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Agent"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl shadow-lg border border-gray-200 backdrop-blur-sm bg-white p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p>Loading delivery agents...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={() => getAgents(true)}>Retry</Button>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">No delivery agents found.</p>
            <Button onClick={() => setIsAddOpen(true)}>Add First Agent</Button>
          </div>
        ) : (
          <DeliveryAgentTable data={agents} onEdit={handleEditAgent} onDelete={handleDeleteAgent} />
        )}
      </div>

      {/* Modals for Add Form */}
      <DeliveryAgentForm isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleAddAgent} />
      {/* Modals for Update Form */}
      <DeliveryAgentForm
        isOpen={isUpdateOpen}
        onClose={handleCloseUpdateModal}
        initialData={
          selectedAgent
            ? {
              firstName: selectedAgent.firstName,
              lastName: selectedAgent.lastName,
              // compnayName: selectedAgent.companyName,
              mobile: selectedAgent.mobile,
              email: selectedAgent.email,
              // address: selectedAgent.address,
              country: selectedAgent.country,
              state: selectedAgent.state,
              city: selectedAgent.city,
              cityPincode: selectedAgent.cityPincode,
              avatar: selectedAgent.avatar || null,
              // avatar: selectedAgent.avatar ?? undefined,
              // avatar: null, // ✅ ensure it's File | null
            }
            : undefined
        }
        onSubmit={handleUpdateAgent}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
