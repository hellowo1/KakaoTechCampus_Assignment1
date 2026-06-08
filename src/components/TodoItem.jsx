import { useState } from 'react'

// 개별 Todo 항목. 수정 모드(isEditing)일 때는 인라인 입력창을 보여준다.
function TodoItem({ todo, onToggle, onDelete, onEdit, onCarryOver }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  function startEdit() {
    setEditText(todo.text)
    setIsEditing(true)
  }

  function saveEdit() {
    const text = editText.trim()
    if (!text) return // 빈 값이면 저장하지 않음
    onEdit(todo.id, text)
    setIsEditing(false)
  }

  function cancelEdit() {
    setEditText(todo.text)
    setIsEditing(false)
  }

  // 수정 모드: prompt() 대신 인라인 입력창
  if (isEditing) {
    return (
      <li className="flex items-center gap-2 rounded-lg border border-violet-300 bg-white p-3 shadow-sm">
        <input
          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-gray-800 focus:border-violet-500 focus:outline-none"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit()
            if (e.key === 'Escape') cancelEdit()
          }}
          autoFocus
        />
        <button
          onClick={saveEdit}
          className="rounded-md bg-violet-600 px-3 py-1 text-sm text-white hover:bg-violet-700"
        >
          저장
        </button>
        <button
          onClick={cancelEdit}
          className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
        >
          취소
        </button>
      </li>
    )
  }

  // 일반 모드
  return (
    <li className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <span
        className={`flex-1 ${
          todo.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
        }`}
      >
        {todo.text}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onToggle(todo.id)}
          title={todo.isCompleted ? '완료 취소하기' : '완료 처리하기'}
          className="rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 hover:bg-green-200"
        >
          {todo.isCompleted ? '취소' : '완료'}
        </button>
        <button
          onClick={() => onCarryOver(todo.id)}
          title="다음 날로 이월하기"
          className="rounded-md bg-amber-100 px-3 py-1 text-sm text-amber-700 hover:bg-amber-200"
        >
          이월
        </button>
        <button
          onClick={startEdit}
          title="할 일 수정하기"
          className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          title="할 일 삭제하기"
          className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
        >
          삭제
        </button>
      </div>
    </li>
  )
}

export default TodoItem
