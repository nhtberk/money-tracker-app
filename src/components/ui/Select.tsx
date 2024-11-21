interface SelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export function Select({ value, onChange, options }: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
} 