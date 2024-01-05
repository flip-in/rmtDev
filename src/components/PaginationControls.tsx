import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { useJobItemsContext } from '../lib/hooks';

export default function PaginationControls() {
  const { currentPage, handleChangePage, totalNumberOfPages } =
    useJobItemsContext();

  return (
    <section className='pagination'>
      {currentPage > 1 && (
        <PaginationButton
          onClick={() => handleChangePage('previous')}
          direction='previous'
          currentPage={currentPage}
        />
      )}
      {currentPage < totalNumberOfPages && (
        <PaginationButton
          onClick={() => handleChangePage('next')}
          direction='next'
          currentPage={currentPage}
        />
      )}
    </section>
  );
}

type PaginationButtonProps = {
  direction: 'next' | 'previous';
  currentPage: number;
  onClick: () => void;
};

function PaginationButton({
  direction,
  currentPage,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      onClick={(e) => {
        onClick();
        e.currentTarget.blur();
      }}
      className={`pagination__button pagination__button--${direction} `}
    >
      {direction === 'previous' && (
        <>
          <ArrowLeftIcon />
          Page {currentPage - 1}
        </>
      )}

      {direction === 'next' && (
        <>
          Page {currentPage + 1}
          <ArrowRightIcon />
        </>
      )}
    </button>
  );
}
