
import AppRoutes from './routes/AppRoutes.tsx'
import PWABadge from './PWABadge.tsx'
import { Toaster } from "react-hot-toast";

// import './App.css'

function App() {

  return (
    <>
     <div className="min-h-screen">
       {/* <Dashboard /> */}
      <AppRoutes />
      <Toaster position="top-right"  />
      <PWABadge />
    </div>
    </>
  )
}

export default App
