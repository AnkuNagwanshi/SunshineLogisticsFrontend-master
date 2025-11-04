import { useState, useEffect } from 'react'
import axiosInstance from '../../services/axiosInstance'
import toast from 'react-hot-toast'

// lucid icons
import { RefreshCw, Users, AlertCircle, Loader2, } from 'lucide-react'
// shadcn ui components
import { Button } from '../ui/button'

// configs

// import { CustomerUsersForm } from '../forms/CustomerUsersForm'
import CustomerUsersTable from '../tables/CustomerUsersTable'
// import { a } from 'node_modules/framer-motion/dist/types.d-Cjd591yU'


interface CustomerUsersData {
  id: number;
  avatar?: File | null | string;
  firstName: string;
  lastName: string;
  email: string;
  // password?: string;
  mobile: number;
  companyName: string;
  country: string;
  state: string;
  city: string;
  address: string;
  role: string;
  info?: string;
}

const CustomerUsers = () => {
  const [customers, setCustomers] = useState<CustomerUsersData[]>([])
  // const [selectedCustomer, setselectedCustomer] = useState<CustomerUsersData | undefined>();
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all delivery agents
  const getAllCustomerUsers = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setIsRefreshing(true)
      else setIsLoading(true)
      setError(null)

      const response = await axiosInstance.get(`${import.meta.env.VITE_API_BASE_URL}/api/customers`)
      const responseData = Array.isArray(response.data) ? response.data : []

      const mappedCustomers = responseData.map((customers: any) => ({
        id: customers.id,
        avatar: customers.avatar ? `${import.meta.env.VITE_API_BASE_URL}${customers.avatar}` : null,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        mobile: customers.mobile,
        companyName: customers.companyName,
        country: customers.country,
        state: customers.state,
        city: customers.city,
        address: customers.address,
        role: customers.role,
        // password: customers.password || null,
      }));

      setCustomers(mappedCustomers);

    } catch (err) {
      console.error('Error fetching customers users:', err)
      setError('Failed to load customers users.')
      toast.error('Failed to load customers users.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    getAllCustomerUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6 backdrop-blur-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Users</h1>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => getAllCustomerUsers(true)} variant="outline" disabled={isLoading || isRefreshing}>
            {isRefreshing ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
            Refresh
          </Button>
          {/* <Button onClick={() => setIsAddOpen(true)}>Add Customer User</Button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl shadow-lg border border-gray-200 backdrop-blur-sm bg-white p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p>Loading customer users...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={() => getAllCustomerUsers(true)}>Retry</Button>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">No customer users found.</p>
            {/* <Button onClick={() => setIsAddOpen(true)}>Add First Customer User</Button> */}
          </div>
        ) : (
          <CustomerUsersTable data={customers}
          // onEdit={handleEditAgent} onDelete={handleDeleteAgent} 
          />
        )}
      </div>

      {/* Modals */}
      {/* <DeliveryAgentForm isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleAddAgent} /> */}
      {/* <DeliveryAgentForm
        isOpen={isUpdateOpen}
        onClose={handleCloseUpdateModal}
        initialData={
          selectedCustomer
            ? {
              firstName: selectedCustomer.firstName,
              lastName: selectedCustomer.lastName,
              email: selectedCustomer.email,
              avatar: selectedCustomer.avatar || null,
            }
            : undefined
        }
        onSubmit={handleUpdateAgent}
      /> */}
    </div>
  )
}

export default CustomerUsers