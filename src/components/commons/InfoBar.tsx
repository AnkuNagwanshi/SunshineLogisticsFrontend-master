import { Mail, Phone } from "lucide-react";

const InfoBar = () => {
    return (
        <div className="relative w-full h-10 flex text-white text-sm font-medium">
            {/* Left side (black) */}
            <div className="flex-1 bg-black text-white py-1 px-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Mail size={16} className="mr-2 text-primary" />
                    <span>naresh.kumar@slservices.in</span>
                </div>
                <div className="flex bg-black flex items-center">
                    <Phone size={16} className="mr-2 text-primary" />
                    <span>+91-9991115845 / +91-9518099121</span>
                </div>
            </div>

            {/* Right side (green with diagonal cut) */}
            <div className="absolute right-0 top-0 h-full w-[40%] clip-path-diagonal bg-primary flex items-center justify-center">
                {/* <img
                    src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                    alt="India Flag"
                    className="w-5 h-5 rounded-full"
                /> */}
                <span>Ship Your First Order</span>
            </div>

            <style>{`
  .clip-path-diagonal {
    clip-path: polygon(12% 0, 100% 0, 100% 100%, 0% 100%);
  }
`}</style>
        </div>
    );
};

export default InfoBar;
