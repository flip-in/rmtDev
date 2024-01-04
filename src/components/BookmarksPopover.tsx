import JobList from './JobList';
import { useBookmarksContext } from '../lib/hooks';
import { forwardRef } from 'react';

const BookmarksPopover = forwardRef<HTMLDivElement>(function (_, ref) {
  const { bookmarkedJobItems, isLoading } = useBookmarksContext();
  return (
    <div ref={ref} className='bookmarks-popover'>
      <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
    </div>
  );
});

export default BookmarksPopover;
