import './SearchInput.css';

interface searchFormat {
  searchFn: (text: string) => void;
}

const SearchInput = (props: searchFormat) => {
  const changeInput = (event: { target: { value: string } }) => {
    props.searchFn(event.target.value);
  };
  return <input className="type-input" type="text" placeholder="Type to search..." onChange={changeInput}></input>;
};

export { SearchInput };
