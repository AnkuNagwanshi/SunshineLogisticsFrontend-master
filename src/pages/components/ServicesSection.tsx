import { Truck, Package, Globe, Clock, Shield, Warehouse } from "lucide-react";

const ServicesSection = () => {
 const services = [
  {
    icon: "🧊",
    title: "Critical & Cold Chain Logistics",
    description: "Specialized transportation for blood samples, plasma, vaccines, and temperature-sensitive healthcare materials. Shipments are handled with dry ice packaging and cold chain monitoring to ensure integrity during transit."
  },
  {
    icon: "🚚",
    title: "Domestic & Healthcare Courier",
    description: "Fast and secure door-to-door courier service across India — covering both laboratory samples and commercial deliveries, with real-time tracking and proof of delivery."
  },
  {
    icon: "✈️",
    title: "International Medical & Commercial Shipping",
    description: "End-to-end global logistics with customs clearance, tracking, and dry-ice–enabled international shipment options for both industrial and diagnostic consignments."
  },
  {
    icon: "⚡",
    title: "Express & Priority Delivery",
    description: "Same-day and next-day delivery options for urgent medical shipments and time-critical cargo. Our team ensures top-priority pickup and on-time delivery across India."
  },
  {
    icon: "🚛",
    title: "Bulk & Industrial Cargo",
    description: "Cost-effective logistics for large-volume, heavy, or specialized shipments, supported by our dedicated fleet and nationwide distribution network."
  },
  {
    icon: "🏢",
    title: "Warehousing & Distribution",
    description: "Advanced warehousing facilities for industrial goods, medical supplies, and diagnostic consumables, with inventory management and temperature-controlled zones."
  }
];
  return (
    <>

      <section className="py-12 pb-8 px-6 lg:px-12">
        {/* Main Heading */}
        <div className="text-center py-4">
          <h1 className="text-4xl font-bold text-gray-900">Our <span className="text-primary">Services</span></h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="mb-4 text-4xl">{service.icon}</div>
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

export default ServicesSection