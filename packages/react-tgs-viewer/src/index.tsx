import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { ungzip } from 'pako';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

interface LottieCacheEntry {
    data: any;
    timestamp: number;
    size: number;
}

interface TgsViewerProps {
  tgsUrl: string;
  staticPreviewUrl?: string;
  corsProxyServerUrl?: string;
  style?: React.CSSProperties;
  quality?: "low" | "medium" | "high";
}

const DEFAULT_CORS_PROXY =
  'https://u60ta2bi82.execute-api.ap-southeast-1.amazonaws.com/cors-server?url=';

const CACHE_CONFIG = {
    MAX_ENTRIES: 50,
    MAX_SIZE_MB: 100,
    CLEANUP_INTERVAL_MS: 300_000,
    TTL_MS: 1_800_000
};

const lottieCache: Map<string, LottieCacheEntry> = new Map();
let cacheSize = 0;

const cleanupCache = () => {
    const now = Date.now();
    const expiredKeys: string[] = [];

    lottieCache.forEach((entry, key) => {
        if (now - entry.timestamp > CACHE_CONFIG.TTL_MS) {
            expiredKeys.push(key);
            cacheSize -= entry.size;
        }
    });

    expiredKeys.forEach(key => lottieCache.delete(key));

    if (cacheSize > CACHE_CONFIG.MAX_SIZE_MB * 1024 * 1024) {
        const sortedEntries = Array.from(lottieCache.entries()).sort(
            ([, a], [, b]) => a.timestamp - b.timestamp
        );

        while (cacheSize > CACHE_CONFIG.MAX_SIZE_MB * 1024 * 1024 * 0.8 && sortedEntries.length > 0) {
            const [key, entry] = sortedEntries.shift()!;
            lottieCache.delete(key);
            cacheSize -= entry.size;
        }
    }
};

// Автоочистка кэша
setInterval(cleanupCache, CACHE_CONFIG.CLEANUP_INTERVAL_MS);

const optimizeFrameRate = (frameRate: number, quality: string) => {
    switch (quality) {
        case "low": return Math.min(frameRate, 30);
        case "medium": return Math.min(frameRate, 60);
        case "high": return Math.min(frameRate, 120);
        default: return Math.min(frameRate, 60);
    }
};

const calculateDataSize = (data: any) => new Blob([JSON.stringify(data)]).size;

const TgsViewer: React.FC<TgsViewerProps> = ({
  tgsUrl,
  staticPreviewUrl,
  corsProxyServerUrl = DEFAULT_CORS_PROXY,
  style = { height: '100px', width: '100px' },
  quality = "high",
}) => {
  const [lottieJson, setLottieJson] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const playerRef = useRef<Player | null>(null);
  const rafRef = useRef<number | null>(null);
  
  // Стабилизируем style через useMemo
  const memoStyle = useMemo(() => style, [JSON.stringify(style)]);

  // Настройки рендера в зависимости от качества
  const renderSettings = useMemo(() => {
    switch (quality) {
      case "low":
        return {
          rendererSettings: {
            context: "2d",
            scaleMode: "noScale",
            clearCanvas: true,
            progressiveLoad: true,
            hideOnTransparent: false,
          },
          speed: 1,
        };
      case "medium":
        return {
          rendererSettings: {
            context: "2d",
            scaleMode: "noScale",
            clearCanvas: true,
            progressiveLoad: false,
            hideOnTransparent: false,
          },
          speed: 1,
        };
      case "high":
      default:
        return {
          rendererSettings: {
            context: "2d",
            scaleMode: "noScale",
            clearCanvas: true,
            progressiveLoad: false,
            hideOnTransparent: false,
            preserveAspectRatio: "xMidYMid slice",
          },
          speed: 1,
        };
    }
  }, [quality]);
    
  // Загрузка и кеширование Lottie-анимации
  const fetchAndCache = useCallback(
    async (url: string) => {
      if (lottieCache.has(url)) {
        const cached = lottieCache.get(url)!;
        cached.timestamp = Date.now();
        return cached.data;
      }

      try {
        const res = await fetch(corsProxyServerUrl + encodeURIComponent(url));
        if (!res.ok) {
          throw new Error(`Network response was not ok (${res.status})`);
        }

        const buffer = await res.arrayBuffer();
        if (!(buffer instanceof ArrayBuffer)) {
          throw new Error("Received data is not an ArrayBuffer.");
        }

        const ungzipped = ungzip(new Uint8Array(buffer));
        const decoded = new TextDecoder("utf-8").decode(ungzipped);
        const json = JSON.parse(decoded);

        // Оптимизация в зависимости от качества
        if (json.fr) {
          json.fr = optimizeFrameRate(json.fr, quality);
        }
        if (json.layers) {
          json.layers = json.layers.map((layer: any) => {
            if (quality === "low") delete layer.mb;
            return layer;
          });
        }

        const size = calculateDataSize(json);
        const cacheEntry = {
          data: json,
          timestamp: Date.now(),
          size,
        };

        if (lottieCache.size >= CACHE_CONFIG.MAX_ENTRIES) {
          cleanupCache();
        }

        lottieCache.set(url, cacheEntry);
        cacheSize += size;

        return json;
      } catch (error) {
        console.error("Error fetching or parsing .tgs:", error);
        throw new Error("Failed to load or parse .tgs file.");
      }
    },
    [corsProxyServerUrl, quality]
  );

  // Загружаем .tgs файл
  useEffect(() => {
    if (!tgsUrl) {
      setLottieJson(null);
      setError(null);
      return;
    }

    setLottieJson(null);
    setError(null);
    setLoading(true);

    if (!tgsUrl.endsWith(".tgs")) {
      setError("Invalid URL: The URL does not end with .tgs");
      setLottieJson(null);
      setLoading(false);
      return;
    }

    fetchAndCache(tgsUrl)
      .then((data) => {
        setLottieJson(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLottieJson(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tgsUrl, fetchAndCache]);

  // Чистим анимацию при размонтировании
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // loader
  const loader = useMemo(
    () =>
      loading &&
      !staticPreviewUrl && (
        <div style={{ ...memoStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      ),
    [loading, staticPreviewUrl, memoStyle]
  );

  // error
  const errorView = useMemo(
    () =>
      error &&
      !staticPreviewUrl && (
        <div style={{ ...memoStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'red', fontSize: 12, textAlign: 'center' }}>{error}</p>
        </div>
      ),
    [error, staticPreviewUrl, memoStyle]
  );

  // preview
  const preview = useMemo(
    () =>
      staticPreviewUrl &&
      !lottieJson && (
        <img
          src={staticPreviewUrl}
          alt="sticker preview"
          style={{ ...memoStyle, objectFit: 'contain' }}
          loading="lazy"
          decoding="async"
        />
      ),
    [staticPreviewUrl, lottieJson, memoStyle]
  );

  // контейнер компонента
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {preview}
      {loader}
      {errorView}

      {lottieJson && (
        <Player
          ref={playerRef}
          autoplay
          loop
          src={lottieJson}
          style={memoStyle}
          speed={renderSettings.speed}
          rendererSettings={renderSettings.rendererSettings}
          keepLastFrame
          background="transparent"
          renderer="canvas"
          onEvent={() => {}}
        >
          <Controls visible={false} buttons={["play", "repeat", "frame", "debug"]} />
        </Player>
      )}
    </div>
  );
};

export default React.memo(TgsViewer);