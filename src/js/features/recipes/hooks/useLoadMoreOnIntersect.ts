import { useEffect, useRef } from "react";

type UseLoadMoreOnIntersectOptions = {
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
};

export function useLoadMoreOnIntersect({
  hasNextPage,
  loading,
  onLoadMore,
}: UseLoadMoreOnIntersectOptions) {
  const target = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = target.current;
    if (!element || !hasNextPage || loading) return;

    const container = element.closest<HTMLElement>("[data-scroll-container]");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onLoadMore();
      },
      { root: container, rootMargin: "160px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, loading, onLoadMore]);

  return target;
}
