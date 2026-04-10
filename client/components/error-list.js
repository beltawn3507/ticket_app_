const ErrorList = ({ errors }) => {
  if (!errors?.length) {
    return null;
  }

  return (
    <div className="error-stack">
      {errors.map((error, index) => (
        <div className="error-card" key={`${error.message}-${index}`}>
          {error.message}
        </div>
      ))}
    </div>
  );
};

export default ErrorList;
