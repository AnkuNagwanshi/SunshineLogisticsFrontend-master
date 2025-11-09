import { currentYear, prevYear } from "../components/commons/constants";
// import SunshineLogo from "../../public/SunshineLogistics_white.png";
import SunshineLogo from "../../public/Sunshine_logo_white.png";
// import SunshineLogo from "../../public/SunshineLogisticsLogo.jpg";
import { Link } from "react-router-dom";
import {
  Home, Info, Briefcase, Mail, MapPin, Truck, Archive, Phone, ShieldCheck, FileText,
  RefreshCw, BookOpen,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* 4-column grid */}
        <div className="grid md:grid-cols-5 gap-6">
          {/* Company */}
          <div className="col-span-full md:col-span-1 p-4">
            <div className="flex justify-center gap-3">
              <img src={SunshineLogo} alt="Sunshine Logistics" className="w-35" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Sunshine is a leading logistics company providing reliable and efficient
              transportation, courier, and supply chain services for businesses large and small.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-full md:col-span-1 p-4">
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Home size={16} className="text-primary" />
                  <span>Home</span>
                </Link>
              </li>

               <li>
                <Link to="/services" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Briefcase size={16} className="text-primary" />
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Info size={16} className="text-primary" />
                  <span>About Us</span>
                </Link>
              </li>
             
              <li>
                <Link to="/contact" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Mail size={16} className="text-primary" />
                  <span>Contact</span>
                </Link>
              </li>
              {/* <li>
                <Link to="/careers" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Users size={16} className="text-primary" />
                  <span>Careers</span>
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-full md:col-span-1 p-4">
            <h2 className="text-lg font-semibold mb-3">Our Services</h2>
            <ul className="space-y-2 text-sm">
               <li>
                <Link to="/request-pickup" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors pointer-events-none">
                  <Truck size={16} className="text-primary" />
                  <span>Request Pickup</span>
                </Link>
              </li>
              <li>
                <Link to="/track" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <MapPin size={16} className="text-primary" />
                  <span>Track Order</span>
                </Link>
              </li>

               
             
              <li>
                <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Archive size={16} className="text-primary" />
                  <span>Warehousing</span>
                </Link>
              </li>
             
              <li>
                <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Phone size={16} className="text-primary" />
                  <span>24/7 Support</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <Truck size={16} className="text-primary" />
                  <span>Door-to-Door Delivery</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-full md:col-span-1 p-4">
            <h2 className="text-lg font-semibold mb-3">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <FileText size={16} className="text-primary" />
                  <span>Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <RefreshCw size={16} className="text-primary" />
                  <span>Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <BookOpen size={16} className="text-primary" />
                  <span>Cookies Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="col-span-full md:col-span-1 p-4">
            <div className="text-sm text-gray-400 space-y-2">
              <h2 className="text-lg font-semibold mb-3 text-white">Get In Touch</h2>

              {/* Location */}
              <div className="flex items-center gap-3 text-gray-300 transition-colors">
                <MapPin size={16} className="text-primary" />
                <span>Plot No. 5, Khasra No. 22/26, Sector B, Defence Colony, Ambala Cant, Ambala (133001), Haryana</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-gray-300 transition-colors">
                <Mail size={16} className="text-primary" />
                <span>info@slservices.in</span>
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex items-center gap-3 text-gray-300 transition-colors">
                <Phone size={16} className="text-primary" />
                <span>+91-99911 15845</span>
                {/* <span>+91-9518099121</span> */}
              </div>
            </div>
          </div>

          {/* Connect to World */}
          {/* <div className="col-span-12 md:col-span-3 p-4">
            <h2 className="text-lg font-semibold mb-3">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <FileText size={16} className="text-primary" />
                  <span>Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <RefreshCw size={16} className="text-primary" />
                  <span>Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors">
                  <BookOpen size={16} className="text-primary" />
                  <span>Cookies Policy</span>
                </Link>
              </li>
            </ul>
          </div> */}


        </div>

        {/* Urgent / Emergency-like box (logistics style) */}
        <div className="mt-8">
          <div className="rounded-lg border border-primary bg-primary-light/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Truck size={28} className="text-primary" />
              <div>
                <h3 className="text-white font-semibold">Urgent Shipment Request?</h3>
                <p className="text-sm text-gray-300">Available 24/7 for immediate pickups & priority deliveries.</p>
              </div>
            </div>

            <div className="text-right">
              {/* CTA: phone or request pickup link */}
              <a
                href="tel:+91-9518099121"
                className="inline-block px-4 py-2 rounded-md border border-primary text-primary-light font-semibold hover:bg-primary-dark/15 transition-colors"
              >
                Request Pickup • 1-800-SUNSHINE
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#484743] px-4 py-6 mt-6 text-sm text-gray-400">
          <div>
            Copyright &copy; {`${prevYear} - ${currentYear}`} All Rights Reserved By <span className="text-white">Sunshine Logistics Service</span>.
          </div>

          <div className="mt-3 md:mt-0 text-gray-400 flex items-center gap-3">
            {/* optional small credit or micro-note */}
            <span>Made with</span>
            <span className="text-primary">♥</span>
            <span>for logistics</span>
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;