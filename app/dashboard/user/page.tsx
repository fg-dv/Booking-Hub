"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, MapPin, Search, Star } from "lucide-react"

// Datos de ejemplo
const myAppointments = [
  {
    id: 1,
    professional: "Dr. Juan Pérez",
    service: "Consulta inicial",
    date: "2023-05-15",
    time: "10:00",
    status: "upcoming",
  },
  {
    id: 2,
    professional: "Dra. Ana García",
    service: "Terapia",
    date: "2023-05-10",
    time: "15:30",
    status: "completed",
  },
]

const professionals = [
  {
    id: 1,
    name: "Dr. Juan Pérez",
    specialty: "Psicólogo Clínico",
    rating: 4.8,
    reviews: 24,
    location: "Madrid, España",
    price: "80€/sesión",
    available: true,
  },
  {
    id: 2,
    name: "Dra. Ana García",
    specialty: "Fisioterapeuta",
    rating: 4.9,
    reviews: 36,
    location: "Barcelona, España",
    price: "65€/sesión",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Carlos Rodríguez",
    specialty: "Nutricionista",
    rating: 4.7,
    reviews: 18,
    location: "Valencia, España",
    price: "70€/sesión",
    available: false,
  },
]

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">BookPro</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Mis Citas
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Bienvenido, María</h2>
          <p className="text-slate-600">Encuentra y agenda citas con profesionales</p>
        </div>

        <div className="mb-6 flex w-full max-w-lg items-center space-x-2">
          <Input
            type="text"
            placeholder="Buscar profesionales, especialidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>

        <Tabs defaultValue="browse">
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Explorar</TabsTrigger>
            <TabsTrigger value="appointments">Mis Citas</TabsTrigger>
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {professionals.map((professional) => (
                <Card key={professional.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{professional.name}</CardTitle>
                        <CardDescription>{professional.specialty}</CardDescription>
                      </div>
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=${professional.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}`}
                          alt={professional.name}
                        />
                        <AvatarFallback>
                          {professional.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 flex items-center text-sm">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{professional.rating}</span>
                      <span className="ml-1 text-slate-500">({professional.reviews} reseñas)</span>
                    </div>
                    <div className="mb-2 flex items-center text-sm text-slate-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{professional.location}</span>
                    </div>
                    <div className="mb-2 flex items-center text-sm text-slate-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{professional.price}</span>
                    </div>
                    <Badge variant={professional.available ? "default" : "outline"} className="mt-2">
                      {professional.available ? "Disponible" : "No disponible"}
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={!professional.available}>
                      Ver Disponibilidad
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Mis Citas</CardTitle>
                <CardDescription>Gestiona tus citas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {appointment.professional
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{appointment.professional}</p>
                          <p className="text-sm text-slate-500">{appointment.service}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <CalendarDays className="h-3 w-3" />
                            <span>{appointment.date}</span>
                            <Clock className="ml-2 h-3 w-3" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={appointment.status === "upcoming" ? "default" : "secondary"}>
                          {appointment.status === "upcoming" ? "Próxima" : "Completada"}
                        </Badge>
                        {appointment.status === "upcoming" && (
                          <Button variant="outline" size="sm">
                            Cancelar
                          </Button>
                        )}
                        {appointment.status === "completed" && (
                          <Button variant="outline" size="sm">
                            Valorar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>Gestiona tu información personal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                      <AvatarFallback className="text-2xl">ML</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold">María López</h3>
                      <p className="text-slate-500">Usuario</p>
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
                          <p>María López</p>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-500">Email</p>
                          <p>maria.lopez@ejemplo.com</p>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-500">Teléfono</p>
                          <p>+34 612 345 678</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Preferencias</h4>
                      <div className="rounded-lg border p-4">
                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-500">Ubicación</p>
                          <p>Madrid, España</p>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-500">Notificaciones</p>
                          <p>Email, SMS</p>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-500">Idioma</p>
                          <p>Español</p>
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
  )
}
