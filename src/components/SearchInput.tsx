type SearchInputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function SearchInput({ value, placeholder, onChange }: SearchInputProps) {
  return (
    <input
      className="search-input"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export default SearchInput;