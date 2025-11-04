import CounterSection from '@/components/commons/CounterSection'
import { ArrowRight } from 'lucide-react'


const AboutSection1 = () => {
  return (
      <section className="about-section overflow-x-hidden">
         {/* Main Heading */}
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold text-gray-900">About <span className="text-primary">Us</span></h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>
        <div className="about-container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left Image */}
          <div
            className="about-img bg-cover bg-no-repeat bg-center w-full h-full 
                 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
            // style={{ backgroundImage: "url('/About.jpg')" }}
            // style={{ backgroundImage: "url('/about-side-image3.avif')" }}
            style={{ backgroundImage: "url('/about-side-image2.jpg')" }}
          ></div>

          {/* Right Content (Overlapping on lg) */}
          <div
            className="bg-white 
                 shadow-none md:shadow-none lg:shadow-[-20px_5px_14px_-15px_rgba(0,0,0,0.13)] 
                 relative lg:ml-[-80px] lg:my-10 z-10 flex items-center"
          >
            <div className="content-section px-4 py-6 sm:px-6 md:px-8 lg:p-10">
              <h2 className="about-heading text-[25px] sm:text-[30px] md:text-[40px] mb-6 text-black/80 font-medium">
                Reliable Logistics, Seamless Deliveries
              </h2>

              <p className="about-typography mb-4 text-gray-600 text-[16px] leading-7">
                Sunshine Logistics Services is a fast-growing courier and logistics
                solution provider, focused on safe, reliable, and timely delivery
                experiences. We combine technology with dedication to make logistics
                simpler and more transparent.
              </p>

              <p className="about-typography mb-6 text-gray-600 text-[16px] leading-7">
                With a continuously expanding network and customer-first approach,
                our mission is to provide end-to-end transport solutions that are
                efficient, secure, and cost-effective for businesses and individuals alike.
              </p>

              <ul className="space-y-3 text-gray-700 text-[16px] leading-7">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  24/7 Customer Support
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  Secure & On-Time Deliveries
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  Real-Time Tracking & Problem Resolution
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-green-500 mr-3 mt-1" />
                  Growing Network With Scalable Solutions
                </li>
              </ul>
            </div>
          </div>
        </div>


        {/* Counter Section */}
        {/* <div className="counter-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mt-12">

          <div className="counter-card p-6">
            <div className="counter-body border-r border-black/10 flex items-center py-3">
              <strong className="number font-semibold text-[50px] text-black">305</strong>
              <span className="counter-title block text-lg text-black/70 leading-snug pl-4">
                Area <br /> Population
              </span>
            </div>
          </div>

          <div className="counter-card p-6">
            <div className="counter-body border-r border-black/10 flex items-center py-3">
              <strong className="number font-semibold text-[50px] text-black">1,090</strong>
              <span className="counter-title block text-lg text-black/70 leading-snug pl-4">
                Total <br /> Properties
              </span>
            </div>
          </div>

          <div className="counter-card p-6">
            <div className="counter-body border-r border-black/10 flex items-center py-3">
              <strong className="number font-semibold text-[50px] text-black">209</strong>
              <span className="counter-title block text-lg text-black/70 leading-snug pl-4">
                Average <br /> House
              </span>
            </div>
          </div>

          <div className="counter-card p-6">
            <div className="counter-body flex items-center py-3">
              <strong className="number font-semibold text-[50px] text-black">67</strong>
              <span className="counter-title block text-lg text-black/70 leading-snug pl-4">
                Total <br /> Branches
              </span>
            </div>
          </div>

        </div> */}

        <CounterSection />
      </section>
  )
}

export default AboutSection1