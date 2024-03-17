// console.error override to filter out messages about AG Grid Enterprise License

const originalConsoleError = console.error;

// Override console.error to filter out messages containing the specified string
console.error = function (...args) {
  const message = args.join(" ");
  if (
    message.includes(
      "****************************************************************************************************************************",
    ) ||
    message.includes("AG Grid Enterprise License") ||
    message.includes("License Key Not Found") ||
    message.includes(
      "All AG Grid Enterprise features are unlocked for trial",
    ) ||
    message.includes(
      "If you want to hide the watermark please email info@ag-grid.com for a trial license key",
    )
  )
    return;

  // Call the original console.error function with the provided arguments
  originalConsoleError.apply(console, args);
};
