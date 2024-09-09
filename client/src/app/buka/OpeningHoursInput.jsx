const OpeningHoursInput = ({ day, index, value, onChange }) => (
  <div key={index} className="grid grid-cols-3 gap-4 items-center mb-4">
    <label className="text-gray-700 font-medium">{day}</label>
    <input
      type="time"
      value={value.openingTime}
      onChange={(e) => onChange(index, "openingTime", e.target.value)}
      className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Opening Time"
    />
    <input
      type="time"
      value={value.closingTime}
      onChange={(e) => onChange(index, "closingTime", e.target.value)}
      className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Closing Time"
    />
  </div>
);

export default OpeningHoursInput;
