import { useEffect } from "react";

const counterData = [
  {
    title: "Founded",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3l9 9" stroke="black" strokeWidth="2" />
        <circle cx="12" cy="15" r="4" fill="#22c55e" />
      </svg>
    ),
    dataCount: 2024,
  },
  {
    title: "Employees",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="4" fill="black" />
        <path d="M4 22c0-4 4-7 8-7s8 3 8 7" stroke="#22c55e" strokeWidth="2" />
      </svg>
    ),
    dataCount: 200,
  },
  {
    title: "Clients",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="8" r="3" fill="black" />
        <circle cx="16" cy="8" r="3" fill="#22c55e" />
        <path d="M2 20c0-3 3-5 6-5s6 2 6 5" stroke="black" strokeWidth="2" />
        <path d="M12 20c0-2.5 2-4 5-4s5 1.5 5 4" stroke="#22c55e" strokeWidth="2" />
      </svg>
    ),
    dataCount: 400,
  },
  {
    title: "Orders",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="black" strokeWidth="2" />
        <path d="M3 9h18" stroke="#22c55e" strokeWidth="2" />
        <circle cx="8" cy="15" r="2" fill="#22c55e" />
        <circle cx="16" cy="15" r="2" fill="black" />
      </svg>
    ),
    dataCount: 1200,
  },
  {
    title: "Shipments",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="10" rx="2" stroke="black" strokeWidth="2" />
        <path d="M3 12h18" stroke="#22c55e" strokeWidth="2" />
        <circle cx="7" cy="17" r="2" fill="black" />
        <circle cx="17" cy="17" r="2" fill="#22c55e" />
      </svg>
    ),
    dataCount: 950,
  },
  {
    title: "Tracking",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="10" r="4" stroke="black" strokeWidth="2" />
        <path d="M12 2v2M12 20v2M4 12H2M22 12h-2" stroke="#22c55e" strokeWidth="2" />
        <path d="M12 14c-2 3-4 5-4 8h8c0-3-2-5-4-8z" fill="#22c55e" />
      </svg>
    ),
    dataCount: 1800,
  },
];

const CounterSection = () => {
  useEffect(() => {
    const counters = document.querySelectorAll(".count");

    const animateCounter = (el:any) => {
      const duration = 2000;
      const targetCount = parseInt(el.dataset.count, 10);
      const increment = targetCount / (duration / 16);
      let currentCount = 0;

      const updateNumber = () => {
        currentCount += increment;
        if (currentCount < targetCount) {
          el.innerText = Math.ceil(currentCount);
          requestAnimationFrame(updateNumber);
        } else {
          el.innerText = targetCount;
        }
      };

      requestAnimationFrame(updateNumber);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target); // Run once
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }, []);

  return (
    <section className="pt-10 pb-5 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 px-6">
        {counterData.map((counter, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-3">
            {/* Icon */}
            <div className="flex items-center justify-center">{counter.svg}</div>

            {/* Number */}
            <h3
              className="count text-3xl font-bold text-black"
              data-count={counter.dataCount}
            >
              0
            </h3>

            {/* Title */}
            <p className="text-gray-600 text-sm font-medium">{counter.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CounterSection;
