import { MapPin, Phone, Mail, Clock } from "lucide-react";
const ContactSection = () => {
    return (
        <>
            <section className="py-4 pb-8 px-6 lg:px-12">
                {/* Main Heading */}
                <div className="text-center py-6">
                    <h1 className="text-4xl font-bold text-gray-900">Contact <span className="text-primary">Us</span></h1>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="tel" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea rows={4} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Head Office</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-6 h-6 text-primary mt-1" />
                                        <p className="text-gray-600">Plot No. 5, Khasra No. 22/26, Sector B, Defence Colony, Ambala Cant, Ambala (133001), Haryana</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Mail className="w-6 h-6 text-primary" />
                                        <p className="text-gray-600">naresh.kumar@slservices.in</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone className="w-6 h-6 text-primary" />
                                        <div className="text-gray-600">
                                            <p>+91-9991115845</p>
                                            <p>+91-9518099121</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Branch Office - Mumbai</h3>
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-primary mt-1" />
                                    <p className="text-gray-600">Kopar, Bhiwandi-421302</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Working Hours</h3>
                                <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-primary mt-1" />
                                    <div className="text-gray-600">
                                        <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                                        <p>Customer Support: 24/7</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ContactSection