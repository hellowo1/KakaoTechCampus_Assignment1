# 📝 생산성 Todo 앱

날짜별로 할 일을 관리하는 React 기반 Todo 앱이에요.
기본 CRUD에 더해 **일간 / 주간 뷰**로 날짜마다 할 일을 나눠 볼 수 있고,
못 끝낸 할 일은 버튼 하나로 **다음 날로 이월**할 수 있어요.
데이터는 로컬스토리지에 저장돼 새로고침해도 그대로 유지돼요.

## ✨ 주요 기능

- **할 일 관리 (CRUD)** — 추가 / 수정 / 완료 / 삭제
- **상태 필터** — 전체 / 진행 중 / 완료
- **일간 뷰** — 날짜를 앞뒤로 이동하며 그날의 할 일만 확인, "오늘" 버튼으로 복귀
- **주간 뷰** — 월~일 7칸 달력에서 날짜별 할 일 개수를 한눈에 보고 날짜 선택
- **이월** — 미완료 할 일을 다음 날로 넘기는 버튼
- **자동 저장** — 모든 변경이 localStorage에 저장되어 새로고침 후에도 유지

## 🛠 기술 스택

- React 19
- Vite 6
- Tailwind CSS 4
- Web Storage API (localStorage)

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
todo-app/
├── index.html
├── src/
│   ├── main.jsx              # 진입점
│   ├── App.jsx               # 상태 관리 + 전체 화면 구성
│   ├── components/
│   │   ├── TodoItem.jsx      # 개별 할 일 항목 (보기 / 인라인 수정)
│   │   └── WeekView.jsx      # 주간 달력 (날짜별 개수 표시)
│   └── utils/
│       └── date.js           # 날짜 포맷 · 주 계산 유틸
└── package.json
```

## 📌 참고사항

- 본 과제는 AI 도구(Claude)를 활용해 구현했어요.
- 과제 1(Vanilla JS)과 동일한 기능을 React 컴포넌트 기반으로 재구현한 버전이에요.
