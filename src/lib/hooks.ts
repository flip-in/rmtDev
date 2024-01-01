import { useState, useEffect } from "react";
import { JobItem} from "./types";
import { BASE_API_URL } from "./constants";
import { useQuery } from "@tanstack/react-query";


export function useJobItem(id: number | null) {
  const {data, isLoading} = useQuery(
    ['job-item', id],
    async () => {
      if (!id) return;
      const response = await fetch(`${BASE_API_URL}/${id}`);
      const data = await response.json();
      return data
    },
    {
      staleTime: 1000 * 60 * 60, //one hour
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: () => {}
    }
  )
  const jobItem = data?.jobItem;
  return  {jobItem, isLoading} as const;

}



export function useJobItems(searchText: string) {
  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalNumberOfResults = jobItems.length;
  const jobItemsSliced = jobItems.slice(0, 7);

  useEffect(() => {
    if (!searchText) return;

    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(
        `${BASE_API_URL}?search=${searchText}`
      );

      const data = await response.json();
      setJobItems(data.jobItems);
      setIsLoading(false);
    };

    fetchData();
  }, [searchText]);

  return {jobItemsSliced, isLoading, totalNumberOfResults}  as const;

}

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue

}

export function useActiveId() {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return activeId;

}

//can be used to get the active job item by combining the above two hooks
export function useActiveJobItem () {
  const id = useActiveId() ;
  const jobItem = useJobItem(id)

  return jobItem
}
