"use client"
import { cn } from "@/lib/utils"

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotsProps {
  slots: TimeSlot[]
  selectedSlot: string | null
  onSelectSlot: (time: string) => void
}

export function TimeSlots({ slots, selectedSlot, onSelectSlot }: TimeSlotsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((slot) => (
        <button
          key={slot.time}
          className={cn(
            "flex h-10 items-center justify-center rounded-md text-sm font-medium transition-colors",
            slot.available && !selectedSlot ? "border border-slate-200 hover:bg-slate-100 hover:text-slate-900" : "",
            slot.available && selectedSlot === slot.time ? "border-slate-900 bg-slate-100 text-slate-900" : "",
            !slot.available ? "cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-400" : "",
          )}
          onClick={() => slot.available && onSelectSlot(slot.time)}
          disabled={!slot.available}
        >
          {slot.time}
        </button>
      ))}
    </div>
  )
}
