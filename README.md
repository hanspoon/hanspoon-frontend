<div align="center">

<img width="350" height="350" alt="logo" src="https://github.com/user-attachments/assets/1c311563-5e84-46f3-8177-fe8ce29c3640" />

읽은 문장을 내 것으로 만드는 한 스푼 

</div>


- [서비스 소개](https://github.com/hanspoon/hanspoon-frontend/edit/chore/update-readme/README.md?pr=/hanspoon/hanspoon-frontend/pull/16#%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%86%8C%EA%B0%9C)
- [기획 배경](https://github.com/hanspoon/hanspoon-frontend/edit/chore/update-readme/README.md?pr=/hanspoon/hanspoon-frontend/pull/16#%EA%B8%B0%ED%9A%8D-%EB%B0%B0%EA%B2%BD)
- [기술 스택](https://github.com/hanspoon/hanspoon-frontend/edit/chore/update-readme/README.md?pr=/hanspoon/hanspoon-frontend/pull/16#%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D)
- [핵심 기능](https://github.com/hanspoon/hanspoon-frontend/edit/chore/update-readme/README.md?pr=/hanspoon/hanspoon-frontend/pull/16#%ED%95%B5%EC%8B%AC-%EA%B8%B0%EB%8A%A5)
- [개발 기록](https://github.com/hanspoon/hanspoon-frontend/edit/chore/update-readme/README.md?pr=/hanspoon/hanspoon-frontend/pull/16#%EA%B0%9C%EB%B0%9C-%EA%B8%B0%EB%A1%9D)

# 한스푼

### 서비스 소개

읽기만 하면 흘러가는 문장에 '한 스푼'의 선택을 더하세요.

좋은 글을 읽고 나서도 뭔가 남는 게 없다는 느낌, 있지 않으신가요? 

**한스푼**은 웹 아티클을 읽으며 마음에 남는 문장을 하이라이트하고, 그것들을 모아 나만의 인사이트로 저장하고 공유하는 크롬 익스텐션입니다.

드래그 한 번으로 문장을 포착하고, 사이드 패널에서 내가 모은 문장들을 한눈에 확인하고, 링크 하나로 아름다운 그리드 카드 형태로 공유할 수 있습니다.

### 기획 배경

좋은 글을 많이 읽는데, 읽고 나면 뭔가 남질 않았습니다.

스크롤을 내리면서 "오, 이 문장 좋다"고 생각했지만 다음 날이면 기억나지 않았습니다. 읽은 것과 기억하는 것은 다른 얘기였습니다. 메모 앱에 따로 옮기거나, 캡처를 찍어 저장하는 방식도 해봤지만 결국 흩어지거나 다시 보지 않게 되었습니다.

그래서 생각했습니다. 읽는 맥락 안에서 바로 포착할 수 있어야 한다고.

브라우저를 떠나지 않고, 글을 읽다가 드래그 한 번으로 문장을 저장하는 경험을 만들고 싶었습니다. 그리고 그 문장들을 다른 사람들과 공유할 때도, 단순한 텍스트 목록이 아닌 시각적으로 아름다운 형태로 보여주고 싶었습니다.

**한스푼**은 그 경험을 직접 만들어 쓰기 위해 시작한 크롬 익스텐션입니다.

### 기술 스택

| 분류 | 기술 |
|------|------|
| **Extension** | ![WXT](https://img.shields.io/badge/WXT-0.20-000000?logo=googlechrome&logoColor=white) |
| **Frontend** | ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) |
| **상태관리** | ![Jotai](https://img.shields.io/badge/Jotai-2-000000) ![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white) |
| **스타일링** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white) |
| **로컬 DB** | ![Dexie](https://img.shields.io/badge/Dexie-IndexedDB-FF6B35) |
| **백엔드** | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) |
| **모노레포** | ![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white) ![Turbo](https://img.shields.io/badge/Turbo-2-EF4444?logo=turborepo&logoColor=white) |
| **코드 품질** | ![Biome](https://img.shields.io/badge/Biome-2-60A5FA?logo=biome&logoColor=white) |
| **분석** | ![PostHog](https://img.shields.io/badge/PostHog-분석-000000?logo=posthog&logoColor=white) |

### 핵심 기능

#### 1. 드래그로 문장 하이라이팅

<p align="center">
  <img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/a36f9d44-6392-4f43-bf24-4c98b20acfd1" />
</p>

웹 페이지를 읽다가 마음에 드는 문장을 드래그하면 하이라이트 툴바가 나타납니다. 버튼 하나로 문장이 IndexedDB에 즉시 저장되고, 다음에 같은 페이지를 방문해도 하이라이트가 복원됩니다.

- 브라우저를 떠나지 않고 읽는 맥락 안에서 바로 포착
- 페이지를 다시 열어도 하이라이트 위치 자동 복원
- 로그인 없이 로컬에서 즉시 사용 가능

#### 2. 사이드 패널에서 하이라이트 모아보기
<p align="center">
  <img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/d590d10c-2afc-4e88-a5b3-d43002cf695d" />
</p>

익스텐션 아이콘을 클릭하면 사이드 패널이 열립니다. 지금까지 하이라이트한 아티클 목록과 각 문장들을 한눈에 확인할 수 있습니다.

- 아티클별로 모아진 하이라이트 목록
- 로컬 우선(Local-first) 아키텍처로 오프라인에서도 동작
- 로그인 시 Supabase 클라우드에 자동 동기화

#### 3. 링크 하나로 하이라이트 공유

<p align="center">
  <img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/c15d8d86-3b74-495d-a587-b3d5c0179e2c" />
  <img width="400" height="300" alt="image" src="https://github.com/user-attachments/assets/9b339aed-73af-4f95-9eb6-561505705545" />
</p>
<p align="center">
  <img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/8fd7adb9-65b4-48cc-b8a2-9a21352e5730" />
</p>

내가 모은 문장들을 링크 하나로 공유할 수 있습니다. 공유 페이지는 하이라이트 문장들을 그리드 카드 형태로 시각적으로 보여주며, 원본 아티클 링크도 함께 제공합니다.

- 공개 공유 링크 생성 (shareId 기반)
- 하이라이트 문장들을 그리드 레이아웃으로 시각화
- 모바일/데스크톱 반응형 레이아웃
- Text Fragment URL로 원본 아티클의 하이라이트 위치 직접 링크

### 개발 기록
- [Supabase 세션 관리가 복잡해진 이유: 함수 호출마다 setSession을 했던 실수](https://chapdo.vercel.app/posts/supabase-%EC%84%B8%EC%85%98-%EA%B4%80%EB%A6%AC%EA%B0%80-%EB%B3%B5%EC%9E%A1%ED%95%B4%EC%A7%84-%EC%9D%B4%EC%9C%A0-%ED%95%A8%EC%88%98-%ED%98%B8%EC%B6%9C%EB%A7%88%EB%8B%A4-setsession%EC%9D%84-%ED%96%88%EB%8D%98-%EC%8B%A4%EC%88%98/)
- [Fetcher에서 QueryOptions까지: 데이터 페칭 계층화 분투기](https://chapdo.vercel.app/posts/fetcher%EC%97%90%EC%84%9C-queryoptions%EA%B9%8C%EC%A7%80-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%8E%98%EC%B9%AD-%EA%B3%84%EC%B8%B5%ED%99%94-%EB%B6%84%ED%88%AC%EA%B8%B0/)
- [1인 개발자를 위한 가장 현실적인 Git 브랜치 전략: main + develop](https://chapdo.vercel.app/posts/1%EC%9D%B8-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-%EA%B0%80%EC%9E%A5-%ED%98%84%EC%8B%A4%EC%A0%81%EC%9D%B8-git-%EB%B8%8C%EB%9E%9C%EC%B9%98-%EC%A0%84%EB%9E%B5-main--develop/)
- [useQuery로 충분한데 왜 useSuspenseQuery를 선택했나](https://chapdo.vercel.app/posts/usequery%EB%A1%9C-%EC%B6%A9%EB%B6%84%ED%95%9C%EB%8D%B0-%EC%99%9C-usesuspensequery%EB%A5%BC-%EC%84%A0%ED%83%9D%ED%96%88%EB%82%98/)
- [버전 올리는 걸 자꾸 잊는다면? GitHub Actions로 배포 사고 막기](https://chapdo.vercel.app/posts/%EB%B2%84%EC%A0%84-%EC%98%AC%EB%A6%AC%EB%8A%94-%EA%B1%B8-%EC%9E%90%EA%BE%B8-%EC%9E%8A%EB%8A%94%EB%8B%A4%EB%A9%B4-github-actions%EB%A1%9C-%EB%B0%B0%ED%8F%AC-%EC%82%AC%EA%B3%A0-%EB%A7%89%EA%B8%B0/)
- [복잡한 동기화 시스템을 삭제하고 얻은 것들](https://chapdo.vercel.app/posts/%EB%B3%B5%EC%9E%A1%ED%95%9C-%EB%8F%99%EA%B8%B0%ED%99%94-%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%9D%84-%EC%82%AD%EC%A0%9C%ED%95%98%EA%B3%A0-%EC%96%BB%EC%9D%80-%EA%B2%83%EB%93%A4/)
