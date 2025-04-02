"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

const TEACHER_NAME = "Prof. Smith";

export default function TeacherDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextClass, setNextClass] = useState<any>(null);

  const schedule = {
    monday: [
      { time: "7:00 - 8:30", subject: "Mathematics", room: "A101", grade: "10th" },
      { time: "10:30 - 12:00", subject: "Mathematics", room: "B203", grade: "11th" },
    ],
    wednesday: [
      { time: "8:30 - 10:00", subject: "Mathematics", room: "A101", grade: "9th" },
    ],
    friday: [
      { time: "7:00 - 8:30", subject: "Mathematics", room: "C105", grade: "6th" },
    ],
  };

  useEffect(() => {
    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Find next class
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDay = days[currentTime.getDay()];
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    let foundNextClass = null;
    let searchDay = currentDay;
    let daysChecked = 0;

    while (!foundNextClass && daysChecked < 7) {
      const daySchedule = schedule[searchDay as keyof typeof schedule] || [];
      
      for (const classSlot of daySchedule) {
        const [startTime] = classSlot.time.split(" - ");
        const [hours, minutes] = startTime.split(":").map(Number);
        
        if (searchDay === currentDay) {
          if (hours > currentHour || (hours === currentHour && minutes > currentMinute)) {
            foundNextClass = { ...classSlot, day: searchDay };
            break;
          }
        } else {
          foundNextClass = { ...classSlot, day: searchDay };
          break;
        }
      }

      if (!foundNextClass) {
        const currentDayIndex = days.indexOf(searchDay);
        searchDay = days[(currentDayIndex + 1) % 7];
        daysChecked++;
      }
    }

    setNextClass(foundNextClass);
  }, [currentTime]);

  return (
    <section className="min-h-screen bg-background">
      <section className="container mx-auto p-6">
        <article className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
          <p className="text-muted-foreground">
            Welcome, {TEACHER_NAME}
          </p>
        </article>

        {nextClass && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <section className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h2 className="text-xl font-semibold mb-2">Next Class</h2>
                <p className="text-lg">
                  Your next class is <span className="font-medium">{nextClass.subject}</span> with{" "}
                  <span className="font-medium">{nextClass.grade} Grade</span>
                </p>
                <p className="text-muted-foreground">
                  {nextClass.day.charAt(0).toUpperCase() + nextClass.day.slice(1)} at {nextClass.time} in Room {nextClass.room}
                </p>
              </section>
            </CardContent>
          </Card>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <section className="space-y-4">
                {Object.entries(schedule).map(([day, slots]) => (
                  <article key={day} className="border rounded p-3">
                    <h3 className="font-semibold capitalize">{day}</h3>
                    {slots.map((slot, index) => (
                      <section key={index} className="mt-2 text-sm">
                        <p className="text-muted-foreground">{slot.time}</p>
                        <p>{slot.subject} - {slot.grade} Grade</p>
                        <p className="text-sm text-muted-foreground">Room {slot.room}</p>
                      </section>
                    ))}
                  </article>
                ))}
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Weekly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <section className="space-y-4">
                <article className="flex justify-between items-center">
                  <span>Total classes:</span>
                  <span className="font-semibold">
                    {Object.values(schedule).reduce((acc, day) => acc + day.length, 0)}
                  </span>
                </article>
                <article className="flex justify-between items-center">
                  <span>Different grades:</span>
                  <span className="font-semibold">
                    {new Set(Object.values(schedule).flat().map(slot => slot.grade)).size}
                  </span>
                </article>
                <article className="flex justify-between items-center">
                  <span>Hours per week:</span>
                  <span className="font-semibold">12</span>
                </article>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Grades Taught
              </CardTitle>
            </CardHeader>
            <CardContent>
              <section className="space-y-2">
                {Array.from(new Set(Object.values(schedule).flat().map(slot => slot.grade))).map((grade) => (
                  <article key={grade} className="p-2 bg-secondary rounded">
                    <p className="font-semibold">{grade} Grade</p>
                    <p className="text-sm text-muted-foreground">
                      {Object.values(schedule).flat().filter(slot => slot.grade === grade).length} classes per week
                    </p>
                  </article>
                ))}
              </section>
            </CardContent>
          </Card>
        </section>
      </section>
    </section>
  );
}