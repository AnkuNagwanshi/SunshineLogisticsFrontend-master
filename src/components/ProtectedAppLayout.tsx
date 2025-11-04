import React, { useState, useEffect } from 'react'
import { SidebarProvider } from './ui/sidebar'
import SiteHeader from './SiteHeader'
import { AppSidebar } from './app-sidebar'
import { Outlet } from 'react-router-dom'

const ProtectedAppLayout: React.FC<{ children: React.ReactNode }> = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <SidebarProvider className="flex flex-col h-screen overflow-hidden">
      <SiteHeader className="flex-shrink-0" 
      // isMobile={isMobile} 
      // isSidebarOpen={isSidebarOpen} 
      onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 bg-gray-100 overflow-hidden">
        <div
          className={`
          fixed md:relative inset-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        >
          <AppSidebar
            className="h-[calc(100vh-80px)] md:h-[calc(100vh-50px)]"
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
        <main className="flex-1 overflow-auto p-0">
          <div className="mt-15 sm:mt-0 md:mt-0 lg:mt-0 h-full">
            <div className="w-full max-w-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default ProtectedAppLayout
