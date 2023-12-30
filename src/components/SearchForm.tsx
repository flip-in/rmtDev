export default function SearchForm({ searchText, setSearchText }) {
  return (
    <form action='#' className='search'>
      <button type='submit' onSubmit={(e) => e.preventDefault()}>
        <i className='fa-solid fa-magnifying-glass'></i>
      </button>

      <input
        value={searchText}
        spellCheck='false'
        type='text'
        required
        placeholder='Find remote developer jobs...'
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      />
    </form>
  );
}
