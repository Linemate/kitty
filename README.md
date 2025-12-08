# 🎉 Linemate (라인메이트)


![Next.js](https://img.shields.io/badge/Next.js-14.2.0+-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.12.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## 🚀 주요 기능

| 카테고리           | 페이지 및 기능                                      |
|--------------------|----------------------------------------------------|
| 홈                 | 메인 페이지, 인기 프로그램                  |
| 인증               | 로그인, 회원가입                                   |
| 프로그램           | 상세보기, 날짜/시간 선택, 결제 (결제중 · 성공 · 실패) |
| 마이페이지         | 마이페이지 홈, 공지사항, 결제 내역, 1:1 문의, 리뷰 관리 |
| 예약 관리          | 프로그램 신청 취소, 환불 요청                      |
| 메이트             | 함께하는 메이트 정보 보기                           |
| 기타               | 404 페이지, 로딩 UI, 반응형 디자인                 |

## 🛠️ 기술 스택

| 항목                | 버전 및 설명                                      |
|---------------------|--------------------------------------------------|
| Node.js             | `v20.12.0` (LTS 추천)                            |
| Next.js             | `v16.0.7+` (App Router + React Server Components) |
| React               | 18.x                                             |
| TypeScript          | 5.x                                              |
| 패키지 매니저       | npm 또는 yarn/pnpm 자유                           |
| 배포                | Vercel 권장 (최적화 최고)                         |

## ⚡ 빠른 시작

```bash
# 1. 레포지토리 클론
git clone https://github.com/Linemate/kitty.git
cd kitty

# 2. 의존성 설치
npm install
# 또는
yarn install

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000 접속

# 빌드
npm run build

# 프로덕션 실행
npm start

## 🌟 프로젝트 구조 (주요 부분만)

app/
├── layout.tsx              → Root Layout
├── page.tsx                → 메인 홈
├── login/page.tsx          → 로그인
├── signup/page.tsx         → 회원가입
├── program/
│   └── [id]/page.tsx       → 프로그램 상세 + 결제
├── payment/
│   ├── loading.tsx
│   ├── success/page.tsx
│   └── fail/page.tsx
├── mypage/
│   ├── page.tsx
│   ├── notice/
│   ├── payments/
│   ├── qna/
│   └── review/
└── cancel/[id]/page.tsx    → 예약 취소

## branch 규칙
feat/기능명 또는 fix/버그설명 형태로 브랜치 이름