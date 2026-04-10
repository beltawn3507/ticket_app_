import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = {}) => {
    try {
      setErrors([]);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(err?.response?.data?.errors || [{ message: "Something went wrong" }]);
      return null;
    }
  };

  return { doRequest, errors };
};

export default useRequest;
