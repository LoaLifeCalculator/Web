import { useLayoutEffect, useMemo } from 'react';

interface MetaTag {
    name: string;
    content: string;
}

interface ScriptTag {
    type?: string;
    innerHTML: string;
}

interface HeadConfig {
    title?: string;
    canonical?: string;
    metas?: MetaTag[];
    scripts?: ScriptTag[];
}

export function useHead({
                            title,
                            canonical,
                            metas = [],
                            scripts = [],
                        }: HeadConfig) {
    // metas/scripts 배열이 바뀔 때만 JSON.stringify 결과가 바뀌게끔
    const metasStr = useMemo(() => JSON.stringify(metas), [metas]);
    const scriptsStr = useMemo(() => JSON.stringify(scripts), [scripts]);

    useLayoutEffect(() => {
        // 1. <title>
        if (title) {
            document.title = title;
        }

        // 2. canonical 링크 (있으면 reuse, 없으면 생성)
        if (canonical) {
            let link = document.head.querySelector<HTMLLinkElement>(
                'link[rel="canonical"][data-head-hook]'
            );
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                link.setAttribute('data-head-hook', 'true');
                document.head.appendChild(link);
            }
            link.setAttribute('href', canonical);
        }

        // 3. meta 태그 (name 기준으로 reuse)
        metas.forEach(({ name, content }) => {
            let meta = document.head.querySelector<HTMLMetaElement>(
                `meta[name="${name}"][data-head-hook]`
            );
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('name', name);
                meta.setAttribute('data-head-hook', 'true');
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });

        // 4. JSON-LD 스크립트 삽입
        scripts.forEach(({ type = 'application/ld+json', innerHTML }) => {
            const script = document.createElement('script');
            script.type = type;
            script.textContent = innerHTML;
            script.setAttribute('data-head-hook', 'true');
            document.head.appendChild(script);
        });

        // Cleanup: 언마운트 또는 deps 변경 전 삽입한 모든 태그 제거
        return () => {
            document.head
                .querySelectorAll<HTMLElement>('[data-head-hook]')
                .forEach(el => el.remove());
        };
    }, [title, canonical, metasStr, scriptsStr]);
}
