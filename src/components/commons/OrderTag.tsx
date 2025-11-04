// commons/OrderTag.tsx
export const OrderTag = ({ type }: { type: 'assigned' | 'city-based' }) => (
  <span
    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full
    ${type === 'assigned'
      ? 'bg-purple-200 text-purple-800 border border-purple-300'
      : 'bg-teal-200 text-teal-800 border border-teal-300'}
    `}
  >
    {type === 'assigned' ? 'Assigned by Admin' : 'City-based Order'}
  </span>
);
