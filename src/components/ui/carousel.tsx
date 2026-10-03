"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

interface CarouselProps {
  /** Accessible name, usually the visible section heading. */
  label: string;
  /** One element per slide. Server-rendered content is fine. */
  children: ReactNode;
  className?: string;
}

interface CarouselPosition {
  firstVisibleIndex: number;
  lastVisibleIndex: number;
  /** How many distinct start positions the track can scroll to. */
  stopCount: number;
  activeStop: number;
}

const INITIAL_POSITION: CarouselPosition = {
  firstVisibleIndex: 0,
  lastVisibleIndex: 0,
  stopCount: 1,
  activeStop: 0,
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Horizontal carousel built on native scroll snapping, so touch swipe works without
 * extra code. Shows one slide (with the next one peeking) on phones, two on tablets
 * and three on desktop. It never moves on its own (design.md section 12).
 */
export function Carousel({ label, children, className }: CarouselProps) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<CarouselPosition>(INITIAL_POSITION);
  const [isMeasured, setIsMeasured] = useState(false);

  const getSlideElements = useCallback(
    () => Array.from(trackRef.current?.children ?? []) as HTMLElement[],
    [],
  );

  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slideElements = getSlideElements();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const viewEnd = track.scrollLeft + track.clientWidth;

    // A start position exists for each slide the track can scroll to, plus the end.
    const stops = slideElements
      .map((slide) => Math.min(slide.offsetLeft, maxScroll))
      .filter((stop, index, all) => all.indexOf(stop) === index);
    const activeStop = stops.reduce(
      (closest, stop, index) =>
        Math.abs(stop - track.scrollLeft) <
        Math.abs(stops[closest] - track.scrollLeft)
          ? index
          : closest,
      0,
    );
    const visible = slideElements
      .map((slide, index) => ({ slide, index }))
      .filter(
        ({ slide }) =>
          slide.offsetLeft >= track.scrollLeft - 1 &&
          slide.offsetLeft + slide.offsetWidth <= viewEnd + 1,
      );

    setPosition({
      firstVisibleIndex: visible[0]?.index ?? 0,
      lastVisibleIndex: visible.at(-1)?.index ?? 0,
      stopCount: Math.max(stops.length, 1),
      activeStop,
    });
    setIsMeasured(true);
  }, [getSlideElements]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };
    scheduleUpdate();
    track.addEventListener("scroll", scheduleUpdate, { passive: true });
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, [updatePosition]);

  function scrollToStop(stopIndex: number) {
    const track = trackRef.current;
    const slide = getSlideElements()[stopIndex];
    if (!track || !slide) return;
    track.scrollTo({
      left: Math.min(slide.offsetLeft, track.scrollWidth - track.clientWidth),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" && canGoNext) {
      event.preventDefault();
      scrollToStop(position.activeStop + 1);
    } else if (event.key === "ArrowLeft" && canGoPrevious) {
      event.preventDefault();
      scrollToStop(position.activeStop - 1);
    }
  }

  const canGoPrevious = position.activeStop > 0;
  const canGoNext = position.activeStop < position.stopCount - 1;
  // Controls render from the start so the page does not shift; they hide only when
  // every slide fits on screen.
  const showControls =
    slides.length > 1 && (!isMeasured || position.stopCount > 1);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={className}
    >
      <div
        ref={trackRef}
        role="group"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`${label} slides. Use the left and right arrow keys to move.`}
        className="relative flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            {slide}
          </div>
        ))}
      </div>

      {showControls && (
        <div className="mt-5 flex items-center justify-between gap-4">
          {/* Dots are a visual aid for mouse and touch; keyboard and screen reader
              users get the buttons and the live summary instead. */}
          <div className="flex items-center" aria-hidden="true">
            {Array.from(
              { length: isMeasured ? position.stopCount : 0 },
              (_, stopIndex) => (
                <button
                  key={stopIndex}
                  type="button"
                  tabIndex={-1}
                  onClick={() => scrollToStop(stopIndex)}
                  className="flex size-6 items-center justify-center"
                >
                  <span
                    className={cn(
                      "size-2 rounded-full transition-colors duration-150",
                      stopIndex === position.activeStop
                        ? "bg-primary"
                        : "bg-border-strong",
                    )}
                  />
                </button>
              ),
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {position.firstVisibleIndex + 1}
            {position.lastVisibleIndex > position.firstVisibleIndex &&
              ` to ${position.lastVisibleIndex + 1}`}{" "}
            of {slides.length}
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="size-10 px-0"
              aria-label="Previous"
              disabled={!canGoPrevious}
              onClick={() => scrollToStop(position.activeStop - 1)}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="size-10 px-0"
              aria-label="Next"
              disabled={!canGoNext}
              onClick={() => scrollToStop(position.activeStop + 1)}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
