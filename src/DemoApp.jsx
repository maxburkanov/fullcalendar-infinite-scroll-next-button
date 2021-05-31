import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timelinePlugin from "@fullcalendar/timeline";
import interactionPlugin from "@fullcalendar/interaction";

function throttle(callback, limit) {
  let waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
}

export default function DemoApp() {
  const calendarRef = useRef(null);

  useEffect(() => {
    const scroller = document.querySelector("tbody .fc-scroller");

    function goNext() {
      const api = calendarRef.current.getApi();
      api.next();
    }

    const throttledGoNext = throttle(goNext, 1000);

    function checkScrolledToEnd(event) {
      const element = event.target;
      const atEnd =
        element.scrollWidth - element.scrollLeft < element.clientWidth + 100;

      if (atEnd) {
        throttledGoNext();
      }
    }

    scroller.addEventListener("scroll", checkScrolledToEnd);

    return () => {
      scroller.removeEventListener("scroll", checkScrolledToEnd);
    };
  }, []);

  useEffect(() => {
    const scroller = document.querySelector("tbody .fc-scroller");
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    function handleMouseDown(e) {
      isDown = true;
      startX = e.pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    }

    function reset() {
      isDown = false;
    }

    function handleMouseMove(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroller.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      scroller.scrollLeft = scrollLeft - walk;
    }

    scroller.addEventListener("mousedown", handleMouseDown);
    scroller.addEventListener("mouseup", reset);
    scroller.addEventListener("mouseleave", reset);
    scroller.addEventListener("mousemove", handleMouseMove);

    return () => {
      scroller.removeEventListener("mousedown", handleMouseDown);
      scroller.removeEventListener("mouseup", reset);
      scroller.removeEventListener("mouseleave", reset);
      scroller.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <FullCalendar
          ref={calendarRef}
          nowIndicator={true}
          timeZone="UTC"
          // scrollTime={null}
          scrollTime="00:00:00"
          plugins={[timelinePlugin, interactionPlugin]}
          initialView="timelineDay"
          events="https://fullcalendar.io/demo-events.json?single-day&timeZone=UTC"
        />
      </div>
    </div>
  );
}
