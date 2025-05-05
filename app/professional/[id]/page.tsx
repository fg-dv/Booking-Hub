"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlots } from "@/components/time-slots"
import { MapPin, Star, Clock, CalendarIcon, ArrowLeft, CheckCircle } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function ProfessionalProfile({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [professionalData, setProfessionalData] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [timeSlots, setTimeSlots] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        setIsLoading(true)

        // Fetch professional data
        const { data: professional, error: professionalError } = await supabaseClient
          .from("professionals")
          .select(`
            *,
            profiles:user_id(*)
          `)
          .eq("id", params.id)
          .single()

        if (professionalError) throw professionalError

        setProfessionalData(professional)
        setProfileData(professional.profiles)

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabaseClient
          .from("services")
          .select("*")
          .eq("professional_id", params.id)
          .order("name")

        if (servicesError) throw servicesError
        setServices(servicesData || [])
        if (servicesData && servicesData.length > 0) {
          setSelectedService(servicesData[0])
        }

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabaseClient
          .from("reviews")
          .select(`
            *,
            profiles:user_id(full_name)
          `)
          .eq("professional_id", params.id)
          .order("created_at", { ascending: false })

        if (reviewsError) throw reviewsError
        setReviews(reviewsData || [])

        // Load time slots for the selected date
        await loadTimeSlots(new Date())
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Ha ocurrido un error al cargar los datos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfessionalData()
  }, [params.id, toast])

  const loadTimeSlots = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]

      const { data, error } = await supabaseClient
        .from("time_slots")
        .select("*")
        .eq("professional_id", params.id)
        .eq("date", formattedDate)
        .order("start_time")

      if (error) throw error

      // Format time slots for the component
      const formattedSlots =
        data?.map((slot) => ({
          id: slot.id,
          time: slot.start_time,
          available: slot.is_available,
        })) || []

      setTimeSlots(formattedSlots)
      setSelectedSlot(null)
      setSelectedSlotId(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al cargar los horarios disponibles",
        variant: "destructive",
      })
    }
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      loadTimeSlots(newDate)
    }
  }

  const handleSlotSelect = (time: string, slotId: string) => {
    setSelectedSlot(time)
    setSelectedSlotId(slotId)
  }

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para reservar una cita",
      })
      router.push("/login")
      return
    }

    if (!selectedService || !selectedSlotId) {
      toast({
        title: "Selección incompleta",
        description: "Por favor, selecciona un servicio y un horario disponible",
        variant: "destructive",
      })
      return
    }

    try {
      setIsBooking(true)

      // Create booking
      const { data, error } = await supabaseClient
        .from("bookings")
        .insert({
          user_id: user.id,
          professional_id: params.id,
          service_id: selectedService.id,
          time_slot_id: selectedSlotId,
          status: "confirmed",
        })
        .select()

      if (error) throw error

      toast({
        title: "Reserva confirmada",
        description: "Tu cita ha sido reservada exitosamente",
      })

      // Reload time slots to reflect the booking
      if (date) {
        await loadTimeSlots(date)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al realizar la reserva",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <h1 className="ml-4 text-xl font-bold">BookPro</h1>
          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <Link href={user ? "/dashboard/user" : "/login"}>
                <Button variant="ghost">Mi Cuenta</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/register">
                  <Button>Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid gap-8 px-4 lg:grid-cols-3">
          {/* Columna izquierda: Información del profesional */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="mb-4 h-32 w-32">
                    <AvatarImage
                      src={profileData?.avatar_url || "/placeholder.svg?height=128&width=128"}
                      alt={profileData?.full_name}
                    />
                    <AvatarFallback>
                      {profileData?.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mb-1 text-2xl font-bold">{profileData?.full_name}</h2>
                  <p className="mb-2 text-slate-500">{professionalData?.specialty}</p>
                  <div className="mb-4 flex items-center justify-center">
                    <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="mr-1 font-medium">{professionalData?.rating || "N/A"}</span>
                    <span className="text-slate-500">({professionalData?.reviews_count || 0} reseñas)</span>
                  </div>

                  <div className="mb-4 w-full space-y-2 text-left">
                    <div className="flex items-center text-slate-500">
                      <MapPin className="mr-2 h-5 w-5" />
                      <span>{profileData?.location || "No especificada"}</span>
                    </div>
                    <div className="flex items-center text-slate-500">
                      <Clock className="mr-2 h-5 w-5" />
                      <span>Desde {professionalData?.price_per_hour}€/hora</span>
                    </div>
                  </div>

                  <div className="mb-4 w-full">
                    <h3 className="mb-2 font-medium">Sobre mí</h3>
                    <p className="text-sm text-slate-600">{professionalData?.description}</p>
                  </div>

                  {professionalData?.education && professionalData.education.length > 0 && (
                    <div className="mb-4 w-full">
                      <h3 className="mb-2 font-medium">Formación</h3>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {professionalData.education.map((edu: string, index: number) => (
                          <li key={index}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha: Reserva y reseñas */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="booking">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="booking">Reservar cita</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              </TabsList>

              <TabsContent value="booking">
                <Card>
                  <CardHeader>
                    <CardTitle>Reserva tu cita</CardTitle>
                    <CardDescription>Selecciona servicio, fecha y hora</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-4 font-medium">1. Selecciona un servicio</h3>
                        <div className="space-y-3">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                selectedService?.id === service.id
                                  ? "border-slate-900 bg-slate-50"
                                  : "hover:border-slate-300"
                              }`}
                              onClick={() => setSelectedService(service)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{service.name}</p>
                                  <p className="text-sm text-slate-500">{service.duration} minutos</p>
                                </div>
                                <p className="font-medium">{service.price}€</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <h3 className="mb-4 mt-6 font-medium">2. Selecciona una fecha</h3>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          className="rounded-md border"
                          disabled={(date) => date < new Date()}
                        />
                      </div>

                      <div>
                        <h3 className="mb-4 font-medium">3. Selecciona una hora</h3>
                        <div className="mb-4 flex items-center text-sm text-slate-500">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>
                            {date?.toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="mb-6">
                          {timeSlots.length > 0 ? (
                            <TimeSlots slots={timeSlots} selectedSlot={selectedSlot} onSelectSlot={handleSlotSelect} />
                          ) : (
                            <p className="text-center text-slate-500">No hay horarios disponibles para esta fecha</p>
                          )}
                        </div>

                        {selectedSlot && selectedService && (
                          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-start">
                              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                              <div>
                                <p className="font-medium text-green-800">Resumen de tu reserva</p>
                                <p className="text-sm text-green-700">
                                  {selectedService.name} con {profileData?.full_name}
                                </p>
                                <p className="text-sm text-green-700">
                                  {date?.toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}{" "}
                                  a las {selectedSlot}
                                </p>
                                <p className="text-sm text-green-700">Precio: {selectedService.price}€</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button className="w-full" disabled={!selectedSlot || isBooking} onClick={handleBooking}>
                          {isBooking
                            ? "Procesando..."
                            : selectedSlot
                              ? "Confirmar reserva"
                              : "Selecciona una hora disponible"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reseñas de clientes</CardTitle>
                    <CardDescription>
                      {professionalData?.reviews_count || 0} reseñas con una valoración media de{" "}
                      {professionalData?.rating || "N/A"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews.map((review) => (
                          <div key={review.id} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="font-medium">{review.profiles?.full_name}</div>
                              <div className="text-sm text-slate-500">
                                {new Date(review.created_at).toLocaleDateString("es-ES")}
                              </div>
                            </div>
                            <div className="mb-2 flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < (review.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-slate-600">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-slate-500">Este profesional aún no tiene reseñas</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
