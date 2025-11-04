import { Truck, Package, Globe, Clock, Shield, Warehouse } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Package className="w-12 h-12 text-primary" />,
      title: "Domestic Courier",
      description: "Fast and reliable door-to-door delivery service across India with real-time tracking capabilities."
    },
    {
      icon: <Globe className="w-12 h-12 text-primary" />,
      title: "International Shipping",
      description: "Secure international logistics solutions with customs clearance and worldwide tracking support."
    },
    {
      icon: <Clock className="w-12 h-12 text-primary" />,
      title: "Express Delivery",
      description: "Same-day and next-day delivery options for urgent shipments with priority handling."
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "Secure Handling",
      description: "Special care for fragile items and valuable packages with insurance coverage options."
    },
    {
      icon: <Warehouse className="w-12 h-12 text-primary" />,
      title: "Warehousing",
      description: "State-of-the-art warehousing facilities with inventory management and distribution services."
    },
    {
      icon: <Truck className="w-12 h-12 text-primary" />,
      title: "Bulk Shipping",
      description: "Cost-effective solutions for large volume shipments with dedicated transport options."
    }
  ];

  return (
    <>
      <section
        className="relative bg-gray-900 text-white"
        style={{
          backgroundImage: "url('/about3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Our <span className="text-primary-light">Services</span></h1>
          <p className="mt-4 text-lg text-gray-200">
            From local deliveries to international shipping — we cover it all
          </p>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>

  )
}

export default Services