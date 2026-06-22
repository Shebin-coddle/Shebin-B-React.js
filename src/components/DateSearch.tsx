type FilterDateProps = {
  selectedDate: string;
  onDateChange: (value: string) => void;
  onClear: () => void;
};

function DateSearch({
  selectedDate,
  onDateChange,
  onClear,
}: FilterDateProps) {
  return (
    <div className="appointment-filters">
      <div>
        <label>Date</label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <button onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
}

export default DateSearch;