
type PickupTagType = "on-time" | "delayed";

export const PickupTag = ({ type }: { type: PickupTagType }) => {
  const tagStyles = {
    "on-time": "bg-green-200 text-green-800 border border-green-300",
    delayed: "bg-red-200 text-red-800 border border-red-300 animate-pulse-slow",
  };

  const tagLabels = {
    "on-time": "Picked up on Time",
    delayed: "Pickup Delayed (24h+)",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${tagStyles[type]}`}
    >
      {tagLabels[type]}
    </span>
  );
};
