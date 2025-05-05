"use server"

import { revalidatePath } from "next/cache"
import { createActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Acciones para profesionales
export async function createService(formData: FormData) {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "No autorizado" }
  }

  // Obtener el ID del profesional
  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .eq("user_id", session.user.id)
    .single()

  if (!professional) {
    return { error: "Perfil profesional no encontrado" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const duration = Number.parseInt(formData.get("duration") as string)
  const price = Number.parseFloat(formData.get("price") as string)

  const { error } = await supabase.from("services").insert({
    professional_id: professional.id,
    name,
    description,
    duration,
    price,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/professional")
  return { success: true }
}

export async function updateService(formData: FormData) {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "No autorizado" }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const duration = Number.parseInt(formData.get("duration") as string)
  const price = Number.parseFloat(formData.get("price") as string)

  const { error } = await supabase
    .from("services")
    .update({
      name,
      description,
      duration,
      price,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/professional")
  return { success: true }
}

export async function deleteService(id: string) {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "No autorizado" }
  }

  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/professional")
  return { success: true }
}

export async function createTimeSlots(formData: FormData) {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "No autorizado" }
  }

  // Obtener el ID del profesional
  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .eq("user_id", session.user.id)
    .single()

  if (!professional) {
    return { error: "Perfil profesional no encontrado" }
  }

  const date = formData.get("date") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string
  const duration = Number.parseInt(formData.get("duration") as string)

  // Convertir las horas a minutos para facilitar el cálculo
  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute

  // Crear slots de tiempo
  const slots = []
  for (let time = startMinutes; time < endMinutes; time += duration) {
    const hour = Math.floor(time / 60)
    const minute = time % 60

    const nextTime = time + duration
    const nextHour = Math.floor(nextTime / 60)
    const nextMinute = nextTime % 60

    if (nextTime <= endMinutes) {
      slots.push({
        professional_id: professional.id,
        date,
        start_time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        end_time: `${nextHour.toString().padStart(2, "0")}:${nextMinute.toString().padStart(2, "0")}`,
        is_available: true,
      })
    }
  }

  const { error } = await supabase.from("time_slots").insert(slots)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/professional")
  return { success: true }
}

// Acciones para usuarios
export async function createBooking(formData: FormData) {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "No autorizado" }
  }

  const professionalId = formData.get("professionalId") as string
  const serviceId = formData.get("serviceId") as string
  const timeSlotId = formData.get("timeSlotId") as string
  const notes = formData.get("notes") as string

  const { error } = await supabase.from("bookings").insert({
    user_id: session.user.id,
    professional_id: professionalId,
    service_id: serviceId,
    time_slot_id: timeSlotId,
    notes,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/user")
  return { success: true }
}

export async function cancelBooking(id: string) {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "No autorizado" }
  }

  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/user")
  return { success: true }
}

export async function createReview(formData: FormData) {
  const supabase = createActionClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "No autorizado" }
  }

  const bookingId = formData.get("bookingId") as string
  const professionalId = formData.get("professionalId") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  const { error } = await supabase.from("reviews").insert({
    user_id: session.user.id,
    professional_id: professionalId,
    booking_id: bookingId,
    rating,
    comment,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/user")
  return { success: true }
}

// Acciones de autenticación
export async function signOut() {
  const supabase = createActionClient()
  await supabase.auth.signOut()
  redirect("/")
}
