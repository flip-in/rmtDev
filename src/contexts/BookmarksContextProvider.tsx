import { ReactNode, createContext, useState } from 'react';

type TBookmarksContext = {
  bookmarkedIds: number[];
  handleToggleBookmark: (id: number) => void;
};

export const BookmarksContext = createContext<TBookmarksContext | null>(null);

export default function BookmarksContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  console.log(bookmarkedIds);

  const handleToggleBookmark = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
    }
  };
  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        handleToggleBookmark,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
