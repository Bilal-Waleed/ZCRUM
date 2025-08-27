import { toast } from "sonner";
import {useState}  from "react";

const useFetch = (cb)=>{
    const [data, setData] = useState(undefined)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)

    const fn = async (...args) => {
        setLoading(true)
        setError(null)
        try {
            const response = await cb(...args)
            setData(response)
            setError(null)
        } catch (err) {
            setError(err);
            toast.error("An error occurred while fetching data: " + err.message);
        } finally {
            setLoading(false)
        }
    }

    return {data, loading, error, fn, setData}
};

export default useFetch;