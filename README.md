# 마사지 예약 사내 시스템 - 프론트엔드 (React)

이 프로젝트는 사내 마사지 예약 시스템의 프론트엔드 애플리케이션입니다. React를 기반으로 구축되었으며, 백엔드 API와 연동하여 사용자 인증, 예약, 공지사항, 문자 발송 등의 기능을 제공합니다.

## 🚀 기술 스택

*   **React**: 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
*   **React Router DOM**: SPA(Single Page Application) 라우팅 관리
*   **React Bootstrap**: Bootstrap 5 기반의 React UI 컴포넌트 라이브러리
*   **React Datepicker**: 날짜 및 시간 선택 UI
*   **Axios (예정)**: 백엔드 API 통신 (현재는 `fetch` 사용)

## ✨ 주요 기능

*   **사용자 인증**: 회원가입 및 로그인
*   **대시보드**: 로그인 후 메인 화면
*   **예약하기**: 마사지 서비스 예약 (날짜, 시간, 서비스 선택)
*   **문자보내기**: 사용자에게 문자 메시지 발송 (수신자 선택, 메시지 입력)
*   **공지사항**: 시스템 공지사항 확인

## 📦 프로젝트 구조

```
massage-system-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── AnnouncementsPage.js
│   │   ├── BookingPage.js
│   │   ├── Dashboard.js
│   │   ├── HomePage.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── SendMessagePage.js
│   │   └── UserSelectionModal.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── .env (선택 사항)
└── README.md
```

## ⚙️ 개발 환경 설정 및 실행

### 1. 백엔드 실행

이 프론트엔드 애플리케이션은 백엔드 API(`http://localhost:8080`)와 통신합니다. 프론트엔드를 실행하기 전에 백엔드 애플리케이션이 실행 중인지 확인해야 합니다.

백엔드 프로젝트(`massage-system-backend`)의 `README.md`를 참조하여 백엔드를 설정하고 실행하십시오.

### 2. 프론트엔드 설정

프로젝트 디렉토리로 이동하여 필요한 의존성을 설치합니다.

```bash
cd massage-system-frontend
npm install
```

### 3. 애플리케이션 실행

개발 서버를 시작합니다.

```bash
npm start
```

애플리케이션은 `http://localhost:3000`에서 실행됩니다.

## 📝 참고 사항

*   **CORS**: 백엔드에서 `http://localhost:3000`으로부터의 요청을 허용하도록 CORS 설정이 되어 있어야 합니다.
*   **보안**: 현재 비밀번호는 BCrypt로 해싱되어 저장되지만, 실제 운영 환경에서는 추가적인 보안 강화가 필요합니다.
*   **더미 데이터**: 백엔드 재시작 시 데이터가 유지되도록 H2 데이터베이스가 파일 모드로 설정되어 있으며, 초기 더미 데이터가 포함되어 있습니다.