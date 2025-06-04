// public/service-worker.js

const CACHE_NAME = 'app-cache-v1';
const FILES_TO_CACHE = [
    '/',               // index.html
    '/index.html',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png',
    // (원한다면 필요한 js/css 파일을 추가)
];

// 1) install 단계: 최소한의 고정 리소스만 미리 캐싱
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// 2) activate 단계: 이전 버전 캐시 정리 (캐시 이름이 바뀌면 자동 삭제)
self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3) fetch 단계:
//    - /images/*.png 요청은 런타임 캐시 전략을 사용
//    - 그 외 요청은 네트워크 우선 전략(실패 시 캐시) 그대로 유지
self.addEventListener('fetch', (evt) => {
    if (evt.request.method !== 'GET') return;

    const requestURL = new URL(evt.request.url);

    // ◆ 1) public/images/ 하위의 .png 요청을 잡아서 캐시하기
    if (
        requestURL.pathname.startsWith('/images/') &&
        requestURL.pathname.endsWith('.png')
    ) {
        evt.respondWith(
            caches.match(evt.request).then((cachedResp) => {
                if (cachedResp) {
                    // 1-1) 캐시에 있으면 바로 반환
                    return cachedResp;
                }
                // 1-2) 캐시가 없으면 네트워크로 가져와서 캐시에 저장 후 반환
                return fetch(evt.request).then((networkResp) => {
                    if (networkResp && networkResp.status === 200) {
                        const cloned = networkResp.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(evt.request, cloned);
                        });
                    }
                    return networkResp;
                });
            })
        );
        return; // 여기서 반환했으므로, 이후 일반 fetch 코드는 실행되지 않음
    }

    // ◆ 2) 그 외 모든 GET 요청: 네트워크 우선, 실패 시 캐시에서 가져오기
    evt.respondWith(
        fetch(evt.request)
            .then((networkResp) => {
                // 네트워크 응답이 정상(200)이라면 캐시에 저장
                if (networkResp && networkResp.status === 200) {
                    const cloned = networkResp.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(evt.request, cloned);
                    });
                }
                return networkResp;
            })
            .catch(() => {
                return caches.match(evt.request);
            })
    );
});
