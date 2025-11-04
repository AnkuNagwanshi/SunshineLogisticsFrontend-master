// Helper to format date
  export const formatDate = (dateStr: string | null) => dateStr ? new Date(dateStr).toLocaleString() : "N/A";