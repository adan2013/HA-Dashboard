const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const Calendar = () => {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  // First day index (Monday = 0, Sunday = 6)
  let firstDayIndex = firstDay.getDay() - 1
  if (firstDayIndex === -1) firstDayIndex = 6

  const dayCells = []
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(<div key={`empty-${i}`} className="p-4" />)
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const isToday = i === date.getDate()
    dayCells.push(
      <div
        key={i}
        className={`rounded p-3 text-center text-gray-200 ${
          isToday
            ? 'bg-blue-600 font-bold'
            : 'border border-gray-500 bg-gray-800'
        }`}
      >
        {i}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-2 text-3xl">
        {new Date().toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })}
      </div>
      <div className="grid w-full max-w-[600px] grid-cols-7 gap-1">
        {dayHeaders.map(day => (
          <div key={day} className="p-2 text-center font-bold text-gray-200">
            {day}
          </div>
        ))}
        {dayCells}
      </div>
    </div>
  )
}

export default Calendar
