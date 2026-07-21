// JSON-LD를 <script> 태그에 넣을 때의 안전 직렬화.
// JSON.stringify는 '<'를 이스케이프하지 않아, 데이터에 '</script>'가 들어가면
// 태그를 탈출할 수 있다. 지금은 콘텐츠가 전부 저장소 안의 상수라 실위험은 없지만,
// 나중에 어떤 데이터가 들어와도 안전하도록 항상 이 함수를 쓴다.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
