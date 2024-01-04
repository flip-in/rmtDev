import { useState, useEffect, useContext } from "react";
import { JobItem, JobItemExpanded} from "./types";
import { BASE_API_URL } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError } from "./utils";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";
import { ActiveIdContext } from "../contexts/ActiveIdContextProvider";

type JobItemApiResponse = {
  public: boolean,
  jobItem: JobItemExpanded
}
// ------------------------------------
const fetchJobItem = async (id:number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_API_URL}/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data
}

export function useJobItemQuery(id: number | null) {
  const {data, isInitialLoading} = useQuery(
    ['job-item', id],
    () => id ? fetchJobItem(id): null,
    {
      staleTime: 1000 * 60 * 60, //one hour
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError
    }
  )
  const jobItem = data?.jobItem;
  const isLoading = isInitialLoading
  return  {jobItem, isLoading} as const;

}

export function useJobItems(ids: number[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['job-item', id],
      queryFn: () => fetchJobItem(id),
      staleTime: 1000 * 60 * 60, //one hour
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError
    }))
  })

  const jobItems = results.map((result) => result.data?.jobItem)
  // .filter(jobItem => jobItem !== undefined)
  // .filter(jobItem => !!jobItem)
  .filter(jobItem => Boolean(jobItem)) as JobItemExpanded[]
  const isLoading = results.some((result) => result.isLoading)

  return {jobItems, isLoading} as const;
}





// ---------------------------------
type JobItemsApiResponse = {
  public: boolean,
  sorted: boolean,
  jobItems: JobItem[]
}

const fetchJobItems = async (searchText: string): Promise<JobItemsApiResponse> => {
  const response = await fetch(
    `${BASE_API_URL}?search=${searchText}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data
}

export function useSearchQuery(searchText: string) {
  const {data, isInitialLoading} = useQuery(
    ['job-items', searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 60, //one hour
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchText),
      onError: handleError
    }
  )


  return {
    jobItems: data?.jobItems, 
    isLoading: isInitialLoading
  }  as const;

}

// ---------------------------------

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
  const jobItem = useJobItemQuery(id)

  return jobItem
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue)));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}

export function useOnClickOutside(refs: React.RefObject<HTMLElement>[], handler: () => void) {
 
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        refs.every(ref => !ref.current?.contains(e.target as Node))
      ) {
        handler()
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [refs, handler]);
}

//-----------------useContext-----------------

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      'useBookmarksContext must be used within a BookmarksContextProvider'
    );
  }

  return context;
}
export function useActiveIdContext() {
  const context = useContext(ActiveIdContext);

  if (!context) {
    throw new Error(
      'useActiveIdContext must be used within a ActiveIdContextProvider'
    );
  }

  return context;
}
