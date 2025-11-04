import { format } from 'date-fns';

type HistoryEntry = {
  id: number;
  status: string;
  location: string | null;
  remarks: string | null;
  createdAt: string;
  updatedBy: {
    firstName: string;
    lastName: string;
  };
};

type ShipmentHistoryProps = {
  history: HistoryEntry[];
};

export const ShipmentHistory = ({ history }: ShipmentHistoryProps) => {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {history.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== history.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    {/* Icon based on status */}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">
                      Status changed to <span className="font-medium">{event.status.replace('_', ' ')}</span>
                      {event.location && ` at ${event.location}`}
                    </p>
                    {event.remarks && (
                      <p className="text-sm text-gray-500 mt-0.5">{event.remarks}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <p>{format(new Date(event.createdAt), 'MMM d, yyyy HH:mm')}</p>
                    <p className="mt-0.5">by {event.updatedBy.firstName} {event.updatedBy.lastName}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};