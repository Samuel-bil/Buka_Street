import { useState, useEffect } from "react";
import axios from "axios";

const endpoint = "https://buka-street.vercel.app/api/cuisines";
function useCuisine() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCuisines = async () => {
      await axios
        .get(endpoint)
        .then((res) => setData(res.data))
        .catch((err) => {
          console.log(err);
        });
    };

    fetchCuisines();
  }, []);

  return { data };
}

export default useCuisine;
