import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// lucide icons
import { LogOut, ChevronsLeft, ChevronsRight, Home, Package, 
Users,UserPlus} from 'lucide-react';

// authContext
import { useAuth } from "@/context/AuthContext";
interface NavItem {
  title: string
  url: string
  icon: any
  badge?: string
  roles: string[] // Add roles property to define which roles can see this tab
}

interface CustomSidebarProps {
  className?: string
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function AppSidebar({ className = '', isMobile = false, onClose }: CustomSidebarProps) {

  const [isCollapsed, setIsCollapsed] = React.useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth();
  
  const role = user?.role;
  // console.log('role :', role);
  
  // Use current location as active item instead of state
  const activeItem = location.pathname

  // Define all navigation items with their allowed roles
  const allNavItems: NavItem[] = [
    {
      title: 'Add Customer',
      url: '/add-customer',
      icon: UserPlus,
      roles: ['admin', 'sub_admin'] // Both admin and sub_admin
    },
    {
      title: 'Customers',
      url: '/customer-users',
      icon: Users,
      roles: ['admin', 'sub_admin'] // Both admin and sub_admin
    },
    
    {
      title: 'Pickup',
      url: '/pickup',
      icon: Package,
      roles: ['admin', 'sub_admin'] // Both admin and sub_admin
    },

    {
      title: 'Orders',
      url: '/orders',
      icon: Package,
      // badge: '3', // Optional: Show number of new orders
      roles: ['admin', 'sub_admin', 'delivery_agent'] // All three roles
    }, 
     {
      title: 'Agents',
      url: '/delivery-agent',
      icon: UserPlus,
      roles: ['admin', 'sub_admin'] // Both admin and sub_admin
    },
    {
      title: 'Sub Admin',
      url: '/add-subadmin',
      icon: UserPlus,
      roles: ['admin'] // Only main admin can access
    },

  ]

  // Filter navigation items based on user role
  const navMainItems = React.useMemo(() => {
    if (!role) return []

    return allNavItems.filter((item) => item.roles.includes(role.toLowerCase()))
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleNavClick = (url: string) => {
    navigate(url)
    if (isMobile && onClose) {
      onClose()
    }
  }

  // If no navigation items are available for the user, show a message
  if (navMainItems.length === 0) {
    return (
      <div className={`w-72 h-full bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl ${className}`}>
        <div className="p-4 text-center">
          <p className="text-gray-500">No accessible sections for your role.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`
        ${isCollapsed ? 'w-16' : 'w-72'} 
        h-full bg-gradient-to-b from-white via-gray-50 to-white 
        shadow-2xl relative
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {/* Header */}
      <div className="bg-red-50/30 backdrop-blur-sm mt-35 sm:mt-20 md:mt-0 lg:mt-0">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-in fade-in-0 slide-in-from-left-2 duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
                <p className="text-xs text-gray-500">
                  {role === 'admin'
                    ? 'Admin Panel'
                    : role === 'sub_admin'
                    ? 'Sub-Admin Panel'
                    : role === 'delivery_agent'
                    ? 'Agent Panel' : 'Agent Panel'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                     hover:bg-red-50 transition-all duration-200
                     text-gray-500 hover:text-red-600"
          >
            {isCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex-1 py-6 px-3 ${isCollapsed ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <nav className="space-y-4">
          {navMainItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeItem === item.url

            return (
              <button
                key={item.url}
                onClick={() => handleNavClick(item.url)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 ease-in-out group relative
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
              >
                {/* Active indicator */}
                {isActive && <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />}

                <div className={`relative ${isActive ? 'text-white' : ''}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                {!isCollapsed && (
                  <>
                    <span className="font-medium text-sm flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <span
                        className={`
                        px-2 py-1 text-xs rounded-full font-medium
                        ${isActive ? 'bg-white/20 text-white border border-white/30' : 'bg-red-100 text-red-600 border border-red-200'}
                      `}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div
                    className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg
                               opacity-0 invisible group-hover:opacity-100 group-hover:visible
                               transition-all duration-200 whitespace-nowrap z-50 border border-gray-600"
                  >
                    {item.title}
                    {item.badge && <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded">{item.badge}</span>}
                  </div>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Separator */}
      <div className="px-3">
        <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />
      </div>

      {/* Footer */}
      <div className="p-3">
        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl
            text-gray-600 hover:text-red-600 hover:bg-red-50
            transition-all duration-200 ease-in-out group relative
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Exit</span>}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div
              className="absolute left-full bottom-2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                         transition-all duration-200 whitespace-nowrap z-50 border border-gray-600"
            >
              Exit
            </div>
          )}
        </button>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-red-500/10 to-transparent" />
      </div>
    </div>
  )
}
