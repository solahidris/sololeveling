// Function to format a timestamp to DD/MM/YYYY
export const formatTimestampToDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad with zero if needed
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
  const year = date.getUTCFullYear(); // Get full year

  return `${day}/${month}/${year}`;
};

// // Example usage
// const timestamp = "2025-02-23T17:59:10.890108+00:00";
// const formattedDate = formatTimestampToDate(timestamp);
// console.log(formattedDate); // Output: "23/02/2025"