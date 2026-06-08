import { useState, useEffect } from 'react'
import TodoItem from './components/TodoItem'
import WeekView from './components/WeekView'
import { formatDate, formatDateLabel, getWeekStartDate, parseDate } from './utils/date'

const STORAGE_KEY = 'minimal_todo_data'
const WEEK_STORAGE_KEY = 'minimal_todo_week_start'

function App() {
  // localStorage에서 초기값을 한 번만 읽어온다.
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  })
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('') // 안내 메시지
  const [currentFilter, setCurrentFilter] = useState('all') // all | active | completed
  const [selectedDate, setSelectedDate] = useState(new Date()) // 선택된 날짜
  // 주간 뷰 시작(월요일). 저장된 값이 있으면 복원, 없으면 이번 주.
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const saved = localStorage.getItem(WEEK_STORAGE_KEY)
    return saved ? parseDate(saved) : getWeekStartDate(new Date())
  })

  // todos가 바뀔 때마다 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // weekStartDate가 바뀔 때마다 저장 ('YYYY-MM-DD' 문자열로)
  useEffect(() => {
    localStorage.setItem(WEEK_STORAGE_KEY, formatDate(weekStartDate))
  }, [weekStartDate])

  // [CRUD - Create] 할 일 추가
  function addTodo() {
    const text = input.trim()
    if (text === '') {
      setMessage('할 일을 입력해 주세요!')
      return
    }
    const new_Todo = {
      id : Date.now(),
      text : text,
      isCompleted : false,
      date : formatDate(selectedDate)
    }
    setTodos([...todos, new_Todo])
    setInput('')
    setMessage('')
  }

  // [CRUD - Delete] 할 일 삭제
  function deleteTodo(id) {
    const result = []
    for(let i =0 ;i<todos.length;i++){
      if(todos[i].id !== id){
        result.push(todos[i])
      }
    }
    setTodos(result)
  }

  // [CRUD - Update] 완료/취소 토글
  function toggleTodo(id) {
    const result = []
    for(let i =0 ;i<todos.length;i++){
      if(todos[i].id === id){
        const new_Todo = {
          ...todos[i],
          isCompleted : !todos[i].isCompleted
        }
        
        result.push(new_Todo)
      }
      else{
        result.push(todos[i])
      }
    }
      setTodos(result)
  
  }

  // [CRUD - Update] 할 일 텍스트 수정
  function editTodo(id, text) {
    const result = []
    for(let i =0 ;i<todos.length;i++){
      if(todos[i].id === id){
        const new_Todo = {
          ...todos[i],
          text : text
        }
        result.push(new_Todo)
      }
      else{
        result.push(todos[i])
      }
    }
    setTodos(result)

  }

  // 이월: 할 일을 다음 날로 넘긴다.
  function carryOverTodo(id) {
    setTodos(
      todos.map((todo) => {
        if (todo.id !== id) return todo
        const next = parseDate(todo.date)
        next.setDate(next.getDate() + 1)
        return { ...todo, date: formatDate(next) }
      })
    )
  }

  // [일간 뷰] 이전 날짜로 이동
  function goToPreviousDate() {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d)
  }

  // [일간 뷰] 다음 날짜로 이동
  function goToNextDate() {
    const n = new Date(selectedDate)
    n.setDate(n.getDate() + 1)
    setSelectedDate(n)
    
  }

  // [일간 뷰] 오늘로 이동 (주간 뷰도 이번 주로 리셋)
  function goToToday() {
      const today = new Date()
      setSelectedDate(today)
      setWeekStartDate(getWeekStartDate(today))
   
  }

  // [일간 뷰] 주간 뷰에서 날짜를 클릭하면 그 날짜를 선택
  function selectDate(date) {
      setSelectedDate(date)
    
  }

  // 이전 주로 이동
  function goToPreviousWeek() {
    const d = new Date(weekStartDate)
    d.setDate(d.getDate() - 7)
    setWeekStartDate(d)
  }

  // 다음 주로 이동
  function goToNextWeek() {
    const d = new Date(weekStartDate)
    d.setDate(d.getDate() + 7)
    setWeekStartDate(d)
  }

  // 선택된 날짜 + 현재 필터에 맞는 Todo만 골라낸다.
  const selectedDateStr = formatDate(selectedDate)
  const filteredTodos = todos.filter((todo) => {
   if(todo.date !== selectedDateStr){
    return false
   }
   if (currentFilter === 'active'){
    return !todo.isCompleted
   }
   else if(currentFilter === 'completed'){
    return todo.isCompleted
   }  
    return true
  })

  const filters = [
    { key: 'all', label: '전체' },
    { key: 'active', label: '진행 중' },
    { key: 'completed', label: '완료' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-violet-200 py-10">
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-violet-700">
          생산성 Todo 앱
        </h1>

        {/* 날짜 네비게이션 */}
        <div className="mb-5 flex items-center justify-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
          <button
            onClick={goToPreviousDate}
            className="rounded-md px-2 py-1 text-violet-600 hover:bg-violet-100"
          >
            ◀
          </button>
          <span className="min-w-[170px] text-center font-semibold text-gray-800">
            {formatDateLabel(selectedDate)}
          </span>
          <button
            onClick={goToNextDate}
            className="rounded-md px-2 py-1 text-violet-600 hover:bg-violet-100"
          >
            ▶
          </button>
          <button
            onClick={goToToday}
            className="ml-2 rounded-md bg-violet-600 px-3 py-1 text-sm font-semibold text-white hover:bg-violet-700"
          >
            오늘
          </button>
        </div>

        {/* 주간 뷰 */}
        <WeekView
          weekStartDate={weekStartDate}
          selectedDate={selectedDate}
          todos={todos}
          onSelectDate={selectDate}
          onPrevWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
        />

        {/* 입력 영역 */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:border-violet-500 focus:outline-none"
            placeholder="할 일을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo()
            }}
            autoComplete="off"
          />
          <button
            onClick={addTodo}
            className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
          >
            추가
          </button>
        </div>

        {/* 안내 메시지 */}
        {message && (
          <p className="mt-2 text-sm text-red-500">{message}</p>
        )}

        {/* 필터 탭 */}
        <div className="mt-6 flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setCurrentFilter(filter.key)}
              className={`flex-1 rounded-md px-3 py-1 text-sm transition-colors ${
                currentFilter === filter.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 할 일 목록 */}
        <ul className="mt-4 flex flex-col gap-2">
          {filteredTodos.length === 0 ? (
            <li className="py-6 text-center text-sm text-gray-400">
              {todos.length === 0
                ? '아직 등록된 할 일이 없어요.'
                : '해당하는 할 일이 없어요.'}
            </li>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                onCarryOver={carryOverTodo}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default App
