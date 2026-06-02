const STORAGE_KEY = 'minimal_todo_data';

let todoItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = 'all';
let selectedDate = new Date();
let weekStartDate; // 아래쪽에서 초기화

const todoInput = document.getElementById('todo-input');  //할 일 배열
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-button');
const dateDisplay = document.getElementById('date-display');
const prevDateButton = document.getElementById('prev-date-button');
const nextDateButton = document.getElementById('next-date-button');
const weekDisplay = document.getElementById('week-display');
const prevWeekButton = document.getElementById('prev-week-button');
const nextWeekButton = document.getElementById('next-week-button');
const weekDaysContainer = document.getElementById('week-days-container');

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoItems));
}

//날짜 데이터 포멧 만들기
function formatDate(date) {
    
    let y = date.getFullYear();
let m = String(date.getMonth() + 1).padStart(2, '0');
let d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
    
}

// 주어진 날짜가 속한 주의 월요일 구하기
function getWeekStartDate(date) {
    const d = new Date(date);
    let t = d.getDay();
    let offset;
    if(t === 0){
        offset = -6;
    }
    else{
        offset = +1;
    }
    d.setDate(d.getDate()- t + offset);
    return d;
}


// weekStart(월요일)부터 7일치 Date 배열 만들기
function getWeekDates(weekStart) {
    let emptyArray= [];
    for (let i = 0;i < 7; i++){
        let d = new Date(weekStart);
        d.setDate(d.getDate()+i);
        emptyArray.push(d);
    }
    return emptyArray;
}

// 특정 날짜에 등록된 할 일 개수 세이
function countTodosOn(dateStr) {
    let cnt = 0;
    for(let i = 0;i < todoItems.length; i++){
        if (todoItems[i].date === dateStr){
            cnt++;
        }
    }
    return cnt;

}

function updateDateDisplay() {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const nalJJa = DAY_NAMES[selectedDate.getDay()];
    dateDisplay.textContent = `${y}년 ${m}월 ${d}일 (${nalJJa})`;
}

function updateWeekDisplay() {
    const weekDates = getWeekDates(weekStartDate);
    const today = formatDate(new Date());
    const selectedStr = formatDate(selectedDate);

    const first = weekDates[0];
    const last = weekDates[6];
    weekDisplay.textContent = `${first.getMonth() + 1}월 ${first.getDate()}일 - ${last.getMonth() + 1}월 ${last.getDate()}일`;

    weekDaysContainer.innerHTML = '';

    for (let i = 0; i < weekDates.length; i++) {
        const date = weekDates[i];
        const dateStr = formatDate(date);

        const dayElement = document.createElement('div');
        dayElement.className = 'week-day';
        if (dateStr === selectedStr) dayElement.classList.add('selected');
        if (dateStr === today) dayElement.classList.add('today');

        dayElement.innerHTML = `
            <div class="day-name">${DAY_NAMES[date.getDay()]}</div>
            <div class="day-number">${date.getDate()}</div>
            <div class="todo-count">${countTodosOn(dateStr)}</div>
        `;

        dayElement.addEventListener('click', function() {
            selectDateFromWeek(dateStr);
    });

    weekDaysContainer.appendChild(dayElement);
}
}

function selectDateFromWeek(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    selectedDate = new Date(year, month - 1, day);
    updateDateDisplay();
    updateWeekDisplay();
    renderTodos();
}

function changeToPreviousDate() {
    selectedDate.setDate(selectedDate.getDate() - 1);
    updateDateDisplay();
    updateWeekDisplay();
    renderTodos();
}

function changeToNextDate() {
    selectedDate.setDate(selectedDate.getDate() + 1);
    updateDateDisplay();
    updateWeekDisplay();
    renderTodos();
}

function changeToPreviousWeek() {
    weekStartDate.setDate(weekStartDate.getDate() - 7);
    updateWeekDisplay();
    renderTodos();
}

function changeToNextWeek() {
    weekStartDate.setDate(weekStartDate.getDate() + 7);
    updateWeekDisplay();
    renderTodos();
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) {
        alert('할 일을 입력해 주세요!');
        return;
    }
    
    let newTodo = {
        id : Date.now(),
        text : text,
        isCompleted : false,
        date : formatDate(selectedDate)

    };
    todoItems.push(newTodo);
    save();
    todoInput.value = '';
    updateWeekDisplay();
    renderTodos();
}

function deleteTodo(id) {
    let newArray = [];
    for(let i = 0; i<todoItems.length; i++){
        if(todoItems[i].id !== id){
            newArray.push(todoItems[i]);
        }
    }
    todoItems = newArray;
    
    save();
    updateWeekDisplay();
    renderTodos();
}




function toggleTodoComplete(id) {
    for(let i = 0; i< todoItems.length; i++){
        if(todoItems[i].id === id){
            todoItems[i].isCompleted = !todoItems[i].isCompleted;
            break;
        }
    }
    save();
    renderTodos();
}

function editTodo(id) {
    const todo = todoItems.find(item => item.id === id);
    if (!todo) return;

    const input = prompt('할 일을 수정하세요', todo.text);
    if (input === null) return; // 취소

    const text = input.trim();
    if (!text) {
        alert('내용을 입력해 주세요.');
        return;
    }

    todo.text = text;
    save();
    renderTodos();
}

// 화면에 보여줄 할 일 목록을 두 단계로 걸러서 return
function getFilteredTodos() {
    const dateStr = formatDate(selectedDate);

    let temp=[];
    for(let i = 0 ; i<todoItems.length ;i++){
        if(todoItems[i].date === dateStr){
            if(currentFilter === 'active'){
                if (todoItems[i].isCompleted === false) {
                    temp.push(todoItems[i]);
                }
            }
            else if(currentFilter === 'completed'){
                if(todoItems[i].isCompleted === true){
                    temp.push(todoItems[i]);
                }
            }
            else{
                temp.push(todoItems[i]);
            }
        }
    }
    return temp;
}

function renderTodos() {
    todoList.innerHTML = '';

    getFilteredTodos().forEach(item => {
        const li = document.createElement('li');

        let liClass = 'todo-item';
        if (item.isCompleted) {
            liClass = liClass + ' completed-item';
        }
        li.className = liClass;

        let textClass = 'todo-text';
        if (item.isCompleted) {
            textClass = textClass + ' completed';
        }

        let completeLabel = '완료';
        if (item.isCompleted) {
            completeLabel = '취소';
        }

        li.innerHTML = `
            <span class="${textClass}">${item.text}</span>
            <div class="button-group">
                <button class="action-button complete-btn">${completeLabel}</button>
                <button class="action-button edit-btn">수정</button>
                <button class="action-button delete-btn">삭제</button>
            </div>
        `;

        li.querySelector('.complete-btn').addEventListener('click', () => toggleTodoComplete(item.id));
        li.querySelector('.edit-btn').addEventListener('click', () => editTodo(item.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(item.id));

        todoList.appendChild(li);
    });
}

function handleFilterClick(e) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderTodos();
}

addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
filterButtons.forEach(button => button.addEventListener('click', handleFilterClick));
prevDateButton.addEventListener('click', changeToPreviousDate);
nextDateButton.addEventListener('click', changeToNextDate);
prevWeekButton.addEventListener('click', changeToPreviousWeek);
nextWeekButton.addEventListener('click', changeToNextWeek);

weekStartDate = getWeekStartDate(new Date());
updateDateDisplay();
updateWeekDisplay();
renderTodos();
