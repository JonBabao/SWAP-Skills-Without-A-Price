import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { createClient } from "../../../lib/supabase/client";

interface Lesson {
  id: string;
  title: string;
  date_time: string;
  mode: string;
  user_id: {
    username: string;
  };
  mentor_id: {
    username: string;
  };
}

const LessonViewer = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState<Lesson[]>([]); 
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);

  const supabase = createClient();

  const [showAllSchedule, setShowAllSchedule] = useState(false);

  const openScheduleModal = () => setShowAllSchedule(true);
  const closeScheduleModal = () => setShowAllSchedule(false);


  useEffect(() => {
    fetchLessonsForDate(selectedDate);
  }, [selectedDate]);

  const fetchLessonsForDate = async (date: Date) => {
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) return console.error("User auth failed", authError);

    const { data: lessonsData, error } = await supabase
      .from("schedules")
      .select(
        `
        id,
        title,
        date_time,
        mode,
        user_id (
          username
        ),
        mentor_id (
          username
        )
      `
      )
      .gte("date_time", start.toISOString())
      .lte("date_time", end.toISOString())
      .or(`user_id.eq.${user.id},mentor_id.eq.${user.id}`); 

    if (error) {
      console.error("Supabase error:", error);
    } else {
      setLessons((lessonsData as Lesson[]) || []);
    }

    const { data: allLessonsData, error: allLessonsError } = await supabase
      .from("schedules")
      .select(
        `
        id,
        title,
        date_time,
        mode,
        user_id (
          username
        ),
        mentor_id (
          username
        )
      `
      )
      .or(`user_id.eq.${user.id},mentor_id.eq.${user.id}`); 

      if (allLessonsError) {
        console.error("Supabase error:", allLessonsError);
      } else {
        setAllLessons((allLessonsData as Lesson[]) || []);
      }
    

  };

  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-2 font-semibold">
      <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}>‹</button>
      <span>{format(currentMonth, "MMMM yyyy")}</span>
      <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}>›</button>
    </div>
  );

  const renderDays = () => {
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return (
      <div className="grid grid-cols-7 text-center font-medium text-gray-600">
        {days.map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day); 
        days.push(
          <div
            key={cloneDay.toString()}
            className={`h-10 flex items-center justify-center cursor-pointer rounded-full m-1 transition ${
              isSameDay(cloneDay, selectedDate) ? "swapOrangeBg text-white" : "hover:bg-gray-200"
            } ${!isSameMonth(cloneDay, monthStart) ? "text-gray-400" : ""}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(cloneDay, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">{days}</div>);
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="w-96 pr-4 font-sans">
      {/* Calendar */}
      <div className="rounded-xl shadow p-2 bg-gray-50">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Schedule Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Schedule</h3>
          <button onClick={openScheduleModal} className="text-sm text-gray-500 hover:underline">See all</button>
        </div>

        {lessons.length === 0 ? (
          <p className="text-gray-500 text-sm">No lessons scheduled for this date.</p>
        ) : (
          lessons.map(lesson => (
            <div key={lesson.id} className="border border-[#CBD7DF] rounded-xl p-4 px-8 shadow-sm mb-4 space-y-2">
              <h4 className="font-bold text-md flex items-center">
                <span className="text-red-500 mr-2 text-xl">•</span>
                {lesson.title}
              </h4>
              <p className="text-sm mt-2"><strong>Learner:</strong> {lesson.user_id?.username}</p>
              <p className="text-sm"><strong>Mentor:</strong> {lesson.mentor_id?.username}</p>
              <p className="text-sm">
                <strong>Date:</strong> {format(new Date(lesson.date_time), "PPP | p")}
              </p>
              <p className="text-sm"><strong>Mode:</strong> {lesson.mode}</p>
              <div className="mt-3 flex gap-3 font-bold justify-center text-center">
                <button className="swapOrangeBg text-white px-4 py-1 rounded-full text-sm ">
                  View Details
                </button>
                <button className="swapOrangeBg text-white px-4 py-1 rounded-full text-sm ">
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAllSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
          <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">All Scheduled Lessons</h2>
              <button onClick={closeScheduleModal} className="text-gray-600 hover:text-gray-900 text-xl font-bold">
                &times;
              </button>
            </div>

            {allLessons.length === 0 ? (
              <p className="text-gray-500 text-sm">No lessons scheduled.</p>
            ) : (
              allLessons.map(lesson => (
                <div key={lesson.id} className="border border-[#CBD7DF] rounded-xl p-4 px-8 shadow-sm mb-4 space-y-2">
                  <h4 className="font-bold text-md flex items-center">
                    <span className="text-red-500 mr-2 text-xl">•</span>
                    {lesson.title}
                  </h4>
                  <p className="text-sm mt-2"><strong>Learner:</strong> {lesson.user_id?.username}</p>
                  <p className="text-sm"><strong>Mentor:</strong> {lesson.mentor_id?.username}</p>
                  <p className="text-sm">
                    <strong>Date:</strong> {format(new Date(lesson.date_time), "PPP | p")}
                  </p>
                  <p className="text-sm"><strong>Mode:</strong> {lesson.mode}</p>
                  <div className="mt-3 flex gap-3 font-bold justify-center text-center">
                    <button className="swapOrangeBg text-white px-4 py-1 rounded-full text-sm ">
                      View Details
                    </button>
                    <button className="swapOrangeBg text-white px-4 py-1 rounded-full text-sm ">
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default LessonViewer;
