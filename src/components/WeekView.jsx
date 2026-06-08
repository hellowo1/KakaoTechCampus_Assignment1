import { DAY_NAMES, formatDate, getWeekDates } from '../utils/date'

// 주간 뷰: 월요일~일요일 7칸을 보여주고, 날짜를 클릭하면 선택된다.
function WeekView({ weekStartDate, selectedDate, todos, onSelectDate, onPrevWeek, onNextWeek }) {
  const weekDates = getWeekDates(weekStartDate)
  const todayStr = formatDate(new Date())
  const selectedStr = formatDate(selectedDate)

  const first = weekDates[0]
  const last = weekDates[6]
  const rangeLabel = `${first.getMonth() + 1}월 ${first.getDate()}일 - ${last.getMonth() + 1}월 ${last.getDate()}일`

  // 특정 날짜에 등록된 Todo 개수
  function countTodosOn(dateStr) {
    return todos.filter((todo) => todo.date === dateStr).length
  }

  return (
    <div className="mb-6">
      {/* 주 이동 네비게이션 */}
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          onClick={onPrevWeek}
          className="text-sm font-medium text-violet-600 hover:text-violet-800"
        >
          ← 이전 주
        </button>
        <span className="text-sm font-semibold text-gray-500">{rangeLabel}</span>
        <button
          onClick={onNextWeek}
          className="text-sm font-medium text-violet-600 hover:text-violet-800"
        >
          다음 주 →
        </button>
      </div>

      {/* 7일 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateStr = formatDate(date)
          const isSelected = dateStr === selectedStr
          const isToday = dateStr === todayStr
          const count = countTodosOn(dateStr)

          // 배경: 선택 여부로 결정 / 테두리: 오늘 여부로 결정 (서로 독립이라 겹쳐도 둘 다 보임)
          let bgClass = 'bg-gray-50 hover:bg-violet-50'
          if (isSelected) bgClass = 'bg-violet-100 font-semibold'

          let borderClass = 'border-gray-100'
          if (isSelected) borderClass = 'border-violet-500'
          if (isToday) borderClass = 'border-rose-400' // 오늘이면 테두리는 항상 분홍

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(date)}
              className={`flex flex-col items-center gap-1 rounded-lg border-2 px-1 py-2 transition-colors ${bgClass} ${borderClass}`}
            >
              <span className="text-xs text-gray-400">{DAY_NAMES[date.getDay()]}</span>
              <span
                className={`text-sm ${isToday ? 'font-bold text-rose-500' : 'text-gray-700'}`}
              >
                {date.getDate()}
              </span>
              <span
                className={`rounded-full px-1.5 text-[10px] font-semibold ${
                  count > 0
                    ? 'bg-violet-100 text-violet-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WeekView
