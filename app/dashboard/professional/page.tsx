"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, DollarSign, Edit, Plus, Settings, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { ServiceForm } from "@/components/service-form"
import { TimeSlotForm } from "@/components/time-slot-form"

export default function ProfessionalDashboard() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [professionalData, setProfessionalData] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false)
  const [stats, setStats] = useState({
    totalClients: 0,
    monthlyAppointments: 0,
    monthlyIncome: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Fetch professional data
        const { data: professional, error: professionalError } = await supabaseClient
          .from("professionals")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (professionalError) throw professionalError
        setProfessionalData(professional)

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabaseClient
          .from("services")
          .select("*")
          .eq("professional_id", professional.id)
          .order("name")

        if (servicesError) throw servicesError
        setServices(servicesData || [])

        // Fetch appointments
        const { data: bookingsData, error: bookingsError } = await supabaseClient
          .from("bookings")
          .select(`
            *,
            profiles:user_id(full_name),
            services:service_id(name),
            time_slots:time_slot_id(date, start_time)
          `)
          .eq("professional_id", professional.id)
          .order("created_at", { ascending: false })

        if (bookingsError) throw bookingsError
        setAppointments(bookingsData || [])

        // Calculate stats
        const uniqueClients = new Set(bookingsData?.map((booking) => booking.user_id) || [])

        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const monthlyBookings =
          bookingsData?.filter((booking) => {
            const bookingDate = new Date(booking.created_at)
            return bookingDate >= firstDayOfMonth
          }) || []

        const monthlyIncome = monthlyBookings.reduce((total, booking) => {
          const service = servicesData?.find((s) => s.id === booking.service_id)
          return total + (service?.price || 0)
        }, 0)

        setStats({
          totalClients: uniqueClients.size,
          monthlyAppointments: monthlyBookings.length,
          monthlyIncome,
        })
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

    fetchData()
  }, [user, toast])

  const handleServiceSubmit = async (serviceData: any) => {
    try {
      const { data, error } = await supabaseClient
        .from("services")
        .insert({
          professional_id: professionalData.id,
          name: serviceData.name,
          description: serviceData.description,
          duration: Number.parseInt(serviceData.duration),
          price: Number.parseFloat(serviceData.price),
        })
        .select()

      if (error) throw error

      setServices([...services, data[0]])
      setShowServiceForm(false)

      toast({
        title: "Servicio creado",
        description: "El servicio ha sido creado exitosamente",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al crear el servicio",
        variant: "destructive",
      })
    }
  }

  const handleTimeSlotSubmit = async (slotData: any) => {
    try {
      // Format the date and time
      const formattedDate = slotData.date.toISOString().split("T")[0]

      // Create slots for the selected time range
      const startTime = new Date(`2000-01-01T${slotData.startTime}:00`)
      const endTime = new Date(`2000-01-01T${slotData.endTime}:00`)
      const slotDuration = Number.parseInt(slotData.duration) // in minutes

      const slots = []
      let currentTime = new Date(startTime)

      while (currentTime < endTime) {
        const slotStartTime = currentTime.toTimeString().substring(0, 5)

        // Calculate end time for this slot
        currentTime = new Date(currentTime.getTime() + slotDuration * 60000)
        const slotEndTime = currentTime.toTimeString().substring(0, 5)

        // Only add the slot if it doesn't exceed the end time
        if (currentTime <= endTime) {
          slots.push({
            professional_id: professionalData.id,
            date: formattedDate,
            start_time: slotStartTime,
            end_time: slotEndTime,
            is_available: true,
          })
        }
      }

      if (slots.length > 0) {
        const { error } = await supabaseClient.from("time_slots").insert(slots)

        if (error) throw error

        setShowTimeSlotForm(false)

        toast({
          title: "Horarios creados",
          description: `Se han creado ${slots.length} slots de tiempo exitosamente`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al crear los horarios",
        variant: "destructive",
      })
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
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">BookPro</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
              <AvatarFallback>
                {profile?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "P"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Panel de Profesional</h2>
            <p className="text-slate-600">Gestiona tus servicios y citas</p>
          </div>
          <Button onClick={() => setShowServiceForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Servicio
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Vista general de tu actividad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <Users className="h-10 w-10 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Clientes Totales</p>
                    <p className="text-2xl font-bold">{stats.totalClients}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <CalendarDays className="h-10 w-10 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Citas Este Mes</p>
                    <p className="text-2xl font-bold">{stats.monthlyAppointments}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <DollarSign className="h-10 w-10 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Ingresos Este Mes</p>
                    <p className="text-2xl font-bold">{stats.monthlyIncome}€</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendario</CardTitle>
                  <CardDescription>Gestiona tu disponibilidad</CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowTimeSlotForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Horarios
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="appointments">
            <TabsList className="mb-4">
              <TabsTrigger value="appointments">Citas</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Próximas Citas</CardTitle>
                  <CardDescription>Gestiona tus citas programadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback>
                                {appointment.profiles?.full_name
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{appointment.profiles?.full_name}</p>
                              <p className="text-sm text-slate-500">{appointment.services?.name}</p>
                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                <CalendarDays className="h-3 w-3" />
                                <span>{appointment.time_slots?.date}</span>
                                <Clock className="ml-2 h-3 w-3" />
                                <span>{appointment.time_slots?.start_time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                              {appointment.status === "confirmed"
                                ? "Confirmada"
                                : appointment.status === "pending"
                                  ? "Pendiente"
                                  : appointment.status === "cancelled"
                                    ? "Cancelada"
                                    : "Completada"}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-500">No tienes citas programadas</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Mis Servicios</CardTitle>
                  <CardDescription>Gestiona los servicios que ofreces</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.length > 0 ? (
                      services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-slate-500">{service.description}</p>
                            <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{service.duration} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                <span>{service.price}€</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-500">No has creado servicios aún</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Perfil Profesional</CardTitle>
                  <CardDescription>Gestiona tu información pública</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                        <AvatarFallback className="text-2xl">
                          {profile?.full_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h3 className="text-xl font-bold">{profile?.full_name}</h3>
                        <p className="text-slate-500">{professionalData?.specialty}</p>
                        <div className="mt-2 flex justify-center gap-2 sm:justify-start">
                          <Button variant="outline" size="sm">
                            Editar Perfil
                          </Button>
                          <Button variant="outline" size="sm">
                            Cambiar Foto
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium">Información Personal</h4>
                        <div className="rounded-lg border p-4">
                          <div className="mb-2">
                            <p className="text-sm font-medium text-slate-500">Nombre</p>
                            <p>{profile?.full_name}</p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-slate-500">Email</p>
                            <p>{user?.email}</p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-slate-500">Teléfono</p>
                            <p>{profile?.phone || "No especificado"}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 font-medium">Información Profesional</h4>
                        <div className="rounded-lg border p-4">
                          <div className="mb-2">
                            <p className="text-sm font-medium text-slate-500">Especialidad</p>
                            <p>{professionalData?.specialty}</p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-slate-500">Categorías</p>
                            <div className="flex flex-wrap gap-1">
                              {professionalData?.categories?.map((category: string) => (
                                <Badge key={category} variant="outline">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-slate-500">Ubicación</p>
                            <p>{profile?.location || "No especificada"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showServiceForm && <ServiceForm onSubmit={handleServiceSubmit} onCancel={() => setShowServiceForm(false)} />}

      {showTimeSlotForm && <TimeSlotForm onSubmit={handleTimeSlotSubmit} onCancel={() => setShowTimeSlotForm(false)} />}
    </div>
  )
}
