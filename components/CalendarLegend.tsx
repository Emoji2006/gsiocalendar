"use client";
import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types";

export default function CalendarLegend({ types }: { types: { label: string; color: string }[] }) {
  return (
    <div className="flex gap-4 p-4 text-sm">
      {types.map((type: { label: string; color: string }) => (
        <div
          key={type.label}
          className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full bg-blue-600"
            style={{ backgroundColor: type.color }}
          />
          {type.label}
        </div>
      ))}
    </div>
  );
}