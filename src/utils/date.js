export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

// Date 객체를 'YYYY-MM-DD' 문자열로 변환 (Todo 저장/비교용)
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 화면에 보여줄 날짜 문자열 
export function formatDateLabel(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}년 ${m}월 ${d}일 (${DAY_NAMES[date.getDay()]})`
}

// 'YYYY-MM-DD' 문자열을 Date 객체로 변환 (localStorage 복원용)
export function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// 주어진 날짜가 속한 주의 월요일 구하기
export function getWeekStartDate(date) {
  const d = new Date(date)
  const day = d.getDay()
  const offset = day === 0 ? -6 : 1 // 일요일이면 6일 전, 아니면 월요일까지
  d.setDate(d.getDate() - day + offset)
  return d
}

// 월요일부터 7일치 Date 배열 만들기
export function getWeekDates(weekStart) {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    dates.push(d)
  }
  return dates
}
