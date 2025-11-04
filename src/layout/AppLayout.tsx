import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
// import { useScrollToTop } from '../hooks/useScrollToTop'

const AppLayout = () => {
  const location = useLocation()

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Add scroll to top behavior
  // useScrollToTop()

  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AppLayout
