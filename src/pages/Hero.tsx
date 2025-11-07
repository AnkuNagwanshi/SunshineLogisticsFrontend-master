
// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuth } from "@/context/AuthContext"


const Hero = () => {
  // const [activeTab, setActiveTab] = useState("track"); // track | ship
  // const [shipType, setShipType] = useState("domestic"); // domestic | international

  // const [trackCode, setTrackCode] = useState("");
  // const [trackResult, setTrackResult] = useState<any>(null);

  // const { user } = useAuth(); // use AuthContext
  return (
    <section
      className="relative bg-gray-900 text-white"
      style={{
        backgroundImage: "url('/hero.jpg')", // Replace with your logistics bg
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-28 flex flex-col lg:flex-row justify-between items-start">
        {/* Hero Text */}
        <div className="text-center lg:text-left max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Fast & Reliable <br />{" "}
            <span className="text-primary-dark">Courier Tracking</span>
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Sunshine Logistics ensures fast, secure, and reliable package
            delivery with real-time tracking across the globe.
          </p>

          {/* {user ? ( */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/track"
                className="px-6 py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition"
              >
                Track Your Shipment
              </a>
              <a
                href="#"// if you want to enable the link then do this href="/login"
                className="px-6 py-3 rounded-md border-2 border-primary-dark text-primary-light font-semibold bg-gray-100 hover:bg-gray-300 transition"
              >
                Request Pickup
              </a>
            </div>
          {/* ) : (
            null
          )} */}


        </div>

        {/* Right Side Popup */}

        {/* {user ? (
          <div className="relative w-full max-w-md mt-12 lg:mt-0 lg:ml-12">
            <div className="bg-black/40 backdrop-blur-lg border-2 border-primary-light/40 shadow-lg rounded-xl p-6">
              {/* Tabs Track / Ship *
              <div className="flex border-b-2 border-primary/40 mb-4">
                <button
                  onClick={() => setActiveTab("track")}
                  className={`flex-1 py-2 font-semibold ${activeTab === "track"
                    ? "border-b-2 border-primary text-primary-light"
                    : ""
                    }`}
                >
                  Track Order
                </button>
                <button
                  onClick={() => setActiveTab("ship")}
                  className={`flex-1 py-2 font-semibold rounded-t-md ${activeTab === "ship"
                    ? "border-b-2 border-primary text-primary-light"
                    : ""
                    }`}
                >
                  Ship Order
                </button>
              </div>

              {/* TRACK ORDER FORM *
              {activeTab === "track" && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    <span className="text-primary-light">Track</span> your order through
                  </h3>

                  <Tabs defaultValue="mobile" className="w-full">
                    {/* Tab List *
                    <TabsList className="w-full flex mb-2 bg-black/40 backdrop-blur-lg py-1">
                      {["mobile", "awb", "orderid", "lrn"].map((val) => (
                        <TabsTrigger
                          key={val}
                          value={val}
                          className="flex-1 py-2 rounded-md text-sm font-medium 
  data-[state=active]:bg-primary data-[state=active]:text-white 
  bg-black/40 text-gray-300 hover:text-primary transition"
                        >
                          {val.toUpperCase()}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* Mobile Tab *
                    <TabsContent value="mobile">
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Enter Mobile"
                          className="w-full px-4 py-2 rounded-md bg-black/40 border border-primary/40 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        />
                        <button className="w-full py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition">
                          Get OTP
                        </button>
                      </div>
                    </TabsContent>

                    {/* Other Tabs *
                    {["awb", "orderid", "lrn"].map((val) => (
                      <TabsContent key={val} value={val}>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder={`Enter ${val.toUpperCase()}`}
                            className="w-full px-4 py-2 rounded-md bg-black/40 border border-primary/40 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-dark"
                          />
                          <button className="w-full py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition">
                            Track Order
                          </button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <p className="mt-4 text-xs text-primary-light hover:underline text-center">
                    Live tracking updates available on our mobile app.
                  </p>
                </div>
              )}

              {/* SHIP ORDER FORM *
              {activeTab === "ship" && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Ship personal courier
                  </h3>

                  {/* Domestic / International toggle *
                  <div className="flex mb-4 rounded-lg overflow-hidden border border-primary/40">
                    <button
                      onClick={() => setShipType("domestic")}
                      className={`flex-1 py-2 ${shipType === "domestic"
                        ? "bg-primary text-white"
                        : "bg-black/40 text-gray-300 hover:text-primary"
                        }`}
                    >
                      Domestic
                    </button>
                    <button
                      onClick={() => setShipType("international")}
                      className={`flex-1 py-2 ${shipType === "international"
                        ? "bg-primary text-white"
                        : "bg-black/40 text-gray-300 hover:text-primary"
                        }`}
                    >
                      International
                    </button>
                  </div>

                  {/* Pin Code Fields *
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter pickup pin code"
                      className="w-full px-4 py-2 rounded-md bg-black/40 border border-primary/40 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Enter delivery pin code"
                      className="w-full px-4 py-2 rounded-md bg-black/40 border border-primary/40 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="w-full py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition">
                      Get OTP & Ship Now
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-gray-400 text-center">
                    <a href="/business" className="text-primary hover:underline">
                      Sign up to ship as a business here
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          null
        )} */}

      </div>
    </section>
  );
};

export default Hero;
