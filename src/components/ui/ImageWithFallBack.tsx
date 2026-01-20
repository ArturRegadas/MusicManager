import React, { useState, useEffect } from "react";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
};

function normalizeLocalPath(path: string) {
  if (!path) return path;
  try {
    if (/^[a-zA-Z]:\\/.test(path) || path.startsWith("/")) {
      const fixed = path.replace(/\\/g, "/");
      if (/^[a-zA-Z]:\//.test(fixed)) {
        return "file:///" + fixed;
      }
      return "file://" + fixed;
    }
  } catch {
    // ignore
  }
  return path;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallback = "https://picsum.photos/300/300",
  style,
  loading = "lazy",
}: Props) {
  const [current, setCurrent] = useState<string | undefined>(() =>
    src ? normalizeLocalPath(src) : undefined
  );
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
    setCurrent(src ? normalizeLocalPath(src) : undefined);
  }, [src]);

  return (

    <img
      src={!errored && current ? current : fallback}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() => setErrored(true)}
    />
  );
}