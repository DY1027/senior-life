// 시니어 든든 서비스워커 — 한 번 방문한 연습을 인터넷 없이도 열 수 있게 한다.
// 배포마다 VERSION을 올리면 이전 캐시가 정리된다 (activate에서 삭제).
// 설계: 페이지는 network-first(항상 최신 우선, 끊기면 저장본), 정적 파일은
// cache-first(해시가 붙어 있어 영원히 유효), 외부 도메인·API는 건드리지 않는다.
const VERSION = "v6";
const PAGES = `dd-pages-${VERSION}`;
const ASSETS = `dd-assets-${VERSION}`;
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((cache) => cache.addAll([OFFLINE_URL, "/"]))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n.startsWith("dd-") && n !== PAGES && n !== ASSETS)
          .map((n) => caches.delete(n))
      );
      await self.clients.claim();
    })()
  );
});

// 업데이트 안내에서 "새로고침"을 누르면 새 버전이 즉시 자리를 잡는다
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    /\.(webp|png|jpg|svg|ico|woff2?)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // 외부(쿠팡·GA·폰트)는 관여하지 않음
  if (url.pathname.startsWith("/api/")) return;

  // 페이지 이동: 네트워크 우선, 성공하면 저장, 끊기면 저장본 → 오프라인 안내
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          if (fresh.ok) {
            const cache = await caches.open(PAGES);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match(OFFLINE_URL)) || Response.error();
        }
      })()
    );
    return;
  }

  // 정적 파일: 캐시 우선 (Next 정적 파일은 내용 해시가 붙어 있어 안전)
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          if (fresh.ok) {
            const cache = await caches.open(ASSETS);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch {
          return Response.error();
        }
      })()
    );
  }
});
