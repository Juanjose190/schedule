"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, GraduationCap, Magnet as Magic, Settings, Users } from "lucide-react";
import { useState } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GRADES = ["6th", "7th", "8th", "9th", "10th", "11th"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "English"];
const TEACHERS = [
  { id: 1, name: "Prof. Smith", subjects: ["Mathematics", "Physics"] },
  { id: 2, name: "Prof. Johnson", subjects: ["Chemistry", "Biology"] },
  { id: 3, name: "Prof. Williams", subjects: ["History", "Literature"] },
  { id: 4, name: "Prof. Brown", subjects: ["English"] },
];

const TIME_SLOTS = [
  "7:00 - 8:30",
  "8:30 - 10:00",
  "10:30 - 12:00",
  "12:00 - 13:30",
  "14:00 - 15:30",
  "15:30 - 17:00",
];

export default function AdminDashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [schedule, setSchedule] = useState<any>({});
  const [activeDay, setActiveDay] = useState("monday");

  const generateSchedule = () => {
    if (!selectedGrade || !selectedSubject || !selectedTeacher || !selectedTimeSlot) {
      return;
    }

    const newSchedule = {
      ...schedule,
      [activeDay]: [
        ...(schedule[activeDay] || []),
        {
          time: selectedTimeSlot,
          subject: selectedSubject,
          teacher: selectedTeacher,
          grade: selectedGrade,
        },
      ],
    };

    setSchedule(newSchedule);
    setSelectedTimeSlot("");
  };

  const autoGenerateSchedule = () => {
    const newSchedule: any = {};
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    
    // For each grade
    GRADES.forEach(grade => {
      // For each subject
      SUBJECTS.forEach(subject => {
        // Find available teachers for this subject
        const availableTeachers = TEACHERS.filter(t => t.subjects.includes(subject));
        if (availableTeachers.length === 0) return;

        // Randomly select a teacher
        const teacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];

        // Randomly select a day and time slot
        const day = days[Math.floor(Math.random() * days.length)];
        const timeSlot = TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)];

        // Add to schedule
        if (!newSchedule[day]) {
          newSchedule[day] = [];
        }

        // Check for conflicts
        const hasConflict = newSchedule[day].some((slot: any) => 
          slot.time === timeSlot || 
          slot.teacher === teacher.name ||
          slot.grade === grade
        );

        if (!hasConflict) {
          newSchedule[day].push({
            time: timeSlot,
            subject,
            teacher: teacher.name,
            grade,
          });
        }
      });
    });

    setSchedule(newSchedule);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text("School Schedule", 14, 15);
    
    // Add schedule for each day
    let yOffset = 30;
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    
    days.forEach(day => {
      if (schedule[day] && schedule[day].length > 0) {
        // Day header
        doc.setFontSize(14);
        doc.text(day.charAt(0).toUpperCase() + day.slice(1), 14, yOffset);
        
        // Table for this day's schedule
        const tableData = schedule[day].map((slot: any) => [
          slot.time,
          slot.subject,
          slot.grade,
          slot.teacher,
        ]);
        
        autoTable(doc, {
          startY: yOffset + 5,
          head: [["Time", "Subject", "Grade", "Teacher"]],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [66, 66, 66] },
        });
        
        // Update offset for next day
        yOffset = (doc as any).lastAutoTable.finalY + 15;
        
        // Add new page if needed
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 20;
        }
      }
    });
    
    // Save the PDF
    doc.save("school-schedule.pdf");
  };

  const availableTeachers = TEACHERS.filter(teacher => 
    teacher.subjects.includes(selectedSubject)
  );

  return (
    <section className="min-h-screen bg-background">
      <section className="container mx-auto p-6">
        <article className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Schedule Generator</h1>
          <p className="text-muted-foreground">
            Create and manage school schedules for all grades
          </p>
        </article>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Schedule Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={autoGenerateSchedule} 
                  className="w-full mb-6"
                  variant="outline"
                >
                  <Magic className="w-4 h-4 mr-2" />
                  Auto-Generate Schedule
                </Button>

                <Tabs defaultValue="monday" className="w-full">
                  <TabsList className="grid grid-cols-5 w-full">
                    {["monday", "tuesday", "wednesday", "thursday", "friday"].map((day) => (
                      <TabsTrigger
                        key={day}
                        value={day}
                        onClick={() => setActiveDay(day)}
                        className="capitalize"
                      >
                        {day}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {["monday", "tuesday", "wednesday", "thursday", "friday"].map((day) => (
                    <TabsContent key={day} value={day} className="space-y-4">
                      <section className="grid grid-cols-2 gap-4">
                        <section className="space-y-2">
                          <Label>Grade</Label>
                          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADES.map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade} Grade
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </section>

                        <section className="space-y-2">
                          <Label>Subject</Label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {SUBJECTS.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </section>

                        <section className="space-y-2">
                          <Label>Teacher</Label>
                          <Select
                            value={selectedTeacher}
                            onValueChange={setSelectedTeacher}
                            disabled={!selectedSubject}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTeachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.name}>
                                  {teacher.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </section>

                        <section className="space-y-2">
                          <Label>Time Slot</Label>
                          <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </section>
                      </section>

                      <Button
                        onClick={generateSchedule}
                        className="w-full"
                        disabled={!selectedGrade || !selectedSubject || !selectedTeacher || !selectedTimeSlot}
                      >
                        Add Class
                      </Button>

                      {schedule[day]?.length > 0 && (
                        <section className="mt-4 space-y-2">
                          <h3 className="font-semibold">Scheduled Classes:</h3>
                          {schedule[day].map((slot: any, index: number) => (
                            <article key={index} className="bg-secondary p-3 rounded">
                              <p className="font-medium">{slot.time}</p>
                              <p>{slot.subject} - {slot.grade} Grade</p>
                              <p className="text-sm text-muted-foreground">{slot.teacher}</p>
                            </article>
                          ))}
                        </section>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <section className="space-y-4">
                  {Object.entries(schedule).map(([day, slots]) => (
                    <article key={day} className="border rounded p-4">
                      <h3 className="font-semibold capitalize mb-2">{day}</h3>
                      <section className="space-y-2">
                        {(slots as any[]).map((slot, index) => (
                          <article key={index} className="bg-secondary p-2 rounded text-sm">
                            <p className="font-medium">{slot.time}</p>
                            <p>{slot.subject} - {slot.grade} Grade</p>
                            <p className="text-muted-foreground">{slot.teacher}</p>
                          </article>
                        ))}
                      </section>
                    </article>
                  ))}
                </section>
                {Object.keys(schedule).length > 0 && (
                  <Button onClick={downloadPDF} className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Export Schedule
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <section className="space-y-2">
                  {TEACHERS.map((teacher) => (
                    <article key={teacher.id} className="p-3 bg-secondary rounded">
                      <p className="font-semibold">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {teacher.subjects.join(", ")}
                      </p>
                    </article>
                  ))}
                </section>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Grades Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <section className="space-y-4">
                  {GRADES.map((grade) => (
                    <article key={grade} className="flex justify-between items-center">
                      <span>{grade} Grade</span>
                      <span className="font-semibold">
                        {Object.values(schedule).flat().filter((slot: any) => slot?.grade === grade).length} Classes
                      </span>
                    </article>
                  ))}
                </section>
              </CardContent>
            </Card>
          </section>
        </section>
      </section>
    </section>
  );
}