# recruit-server

## 1. 프로젝트의 목표

- 3-Layered Architecture와 테스트 코드를 적용하여 기존 프로텍트의 유지 보수성과 신뢰성을 높입니다.

## 2. [api](https://rift-gallium-045.notion.site/Node-js-API-5a253be774a0433e964592170517b3b4?pvs=4)

## 3. [ERD](https://drawsql.app/teams/currypangs-team/diagrams/recruit-server) 
도메인: https://currypang.shop/

## 4. 필수 요구 사항 (완료)

### Layer 분리

- [x] Controller, Service, Repository를 각각 **파일**로 만들고 **Class**로 정의하여 사용합니다.
- [x] Class의 Method는 **화살표 함수(Arrow Function)** 형태로 구현합니다.
- [x] **Router에 있는 코드**를 Controller, Service, Repository Class의 Method로 **분배**합니다.
- [x] 항상 3개의 Layer가 모두 있어야 되는 것은 아닙니다.
    - 예) DB에 접근하는 코드가 없다면 Repository Layer 생략 가능
- [x] 추천 리팩토링 진행 순서
    - 내 정보 조회 API → 인증 (회원가입, 로그인) API → 인증 미들웨어 → 이력서 API
    - Controller → Service → Repository
    - 인증 미들웨어는 3-Layer로 나누는 것이 아니라 prisma 대신 Service 또는 Repository를 사용하도록 합니다.

### Layer 분리 후 에러 처리

- [x] 오직 Controller에서만 **req, res, next** 를 사용할 수 있습니다.
- [x] **Http Error Class**와 **에러 처리 Middleware**를 활용하여 관리합니다.
    - 아래 Error Class를 에러 처리 Middleware에서 사용하려면 코드 수정이 필요합니다.

## 개발 (선택): Unit Test 작성 (완료)

### 의존성 주입(Dependency Injection, DI)

- [x] Layer 간의 결합도를 낮추기 위해 의존성이 있는 코드는 생성 시 주입 받을 수 있도록 수정합니다.
    - 예: Repository instance 생성 시 prisma instance 주입 받아서 생성
- [x] Repository → Service → Controller → Router 순서로 진행합니다.

### Controller, Service, Repository의 Unit Test 작성

- [x] Jest의 Mock Functions를 이용하여 Controller, Service, Repository의 Unit Test를 작성합니다.
- Repository → Service → Controller 순서로 진행합니다.

## **테스트:** API Client로 동작 확인 (완료)

- [x] **Insomnia Client**를 이용하여 구현 한 모든 API가 정상 동작하는지 확인합니다.

- [x] AccessToken, RefreshToken은 반드시 Header에 **`Bearer Token`**형태로 넣어서 사용하세요.

## 배포: 누구나 이용할 수 있도록 하기 (완료)
- [x] **AWS EC2** 인스턴스에 프로젝트를 배포합니다.
- [x] **PM2**를 이용해 터미널을 종료하더라도 서버가 실행될 수 있도록 설정합니다.
- [x] **(선택) AWS 로드밸런서**와 **AWS ACM**을 이용해서 **https**로 서비스 할 수 있으면 더욱 좋습니다! 
- [x] **(선택) Gabia** 또는 **AWS Route 53**을 이용해 도메인 주소를 연결한다면 더더욱 좋습니다!
- [x] 배포된 **EC2 IP 주소, 로드밸런서 주소,** **연결한 도메인 주소** 중 하나를 제출해주세요!
