const catchAsyncError = (func) => {
    return (req, res, next) => {
      Promise.resolve(func(req, res, next)).catch(next);
    };
  };

  export default catchAsyncError;

  // A helper for handling async errors with the
  // API requests and response handler (Controller)
  // And passes any errors to the error handler