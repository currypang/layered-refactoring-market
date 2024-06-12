export default {
  // 해당 패턴에 일치하는 경로가 존재할 경우 테스트를 하지 않고 넘어갑니다.
  testPathIgnorePatterns: ['/node_modules/'],
  // 테스트 실행 시 각 TestCase에 대한 출력을 해줍니다.
  verbose: true,
  // *.test.js, *.spec.js 파일만 테스트 파일로 인식해서 실행합니다.
  testRegex: '.*\\.(test|spec)\\.js$',
};
