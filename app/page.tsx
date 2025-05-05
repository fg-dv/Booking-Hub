import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Clock, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo para el marketplace
const featuredProfessionals = [
  {
    id: 1,
    name: "Dr. Juan Pérez",
    specialty: "Psicólogo Clínico",
    rating: 4.8,
    reviews: 24,
    location: "Madrid, España",
    price: "80€/sesión",
    available: true,
    image: "/placeholder.svg?height=80&width=80",
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
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Dr. Carlos Rodríguez",
    specialty: "Nutricionista",
    rating: 4.7,
    reviews: 18,
    location: "Valencia, España",
    price: "70€/sesión",
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Dra. Laura Martínez",
    specialty: "Dentista",
    rating: 4.6,
    reviews: 42,
    location: "Sevilla, España",
    price: "90€/sesión",
    available: true,
    image: "/placeholder.svg?height=80&width=80",
  },
]

// Categorías de profesionales
const categories = [
  "Psicología",
  "Fisioterapia",
  "Nutrición",
  "Odontología",
  "Dermatología",
  "Entrenamiento personal",
  "Asesoría legal",
  "Coaching",
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">BookPro</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto pb-20">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Encuentra y reserva profesionales en minutos
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
              Marketplace de profesionales con sistema de reservas en tiempo real
            </p>

            {/* Buscador principal */}
            <div className="mx-auto mb-8 max-w-2xl rounded-lg bg-white p-4 shadow-md">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Input placeholder="¿Qué profesional buscas?" className="w-full" />
                </div>
                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madrid">Madrid</SelectItem>
                      <SelectItem value="barcelona">Barcelona</SelectItem>
                      <SelectItem value="valencia">Valencia</SelectItem>
                      <SelectItem value="sevilla">Sevilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register?role=user">
                <Button size="lg" className="w-full sm:w-auto">
                  Buscar Profesionales
                </Button>
              </Link>
              <Link href="/register?role=professional">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Registrarme como Profesional
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="mb-12">
          <div className="px-4">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">Explora por categoría</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
              {categories.map((category, index) => (
                <Link href={`/category/${category.toLowerCase()}`} key={index}>
                  <div className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 rounded-full bg-slate-100 p-3">
                      <div className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Profesionales destacados */}
        <section className="mb-12">
          <div className="px-4">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">Profesionales destacados</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProfessionals.map((professional) => (
                <Card key={professional.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={professional.image || "/placeholder.svg"} alt={professional.name} />
                        <AvatarFallback>
                          {professional.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        <p className="text-sm text-slate-500">{professional.specialty}</p>
                        <div className="mt-1 flex items-center text-sm">
                          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{professional.rating}</span>
                          <span className="ml-1 text-slate-500">({professional.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{professional.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{professional.price}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Próxima disponibilidad: Hoy</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 p-4">
                    <Link href={`/professional/${professional.id}`} className="w-full">
                      <Button className="w-full">Ver disponibilidad</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/search">
                <Button variant="outline">Ver todos los profesionales</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="mb-12">
          <div className="px-4">
            <h3 className="mb-8 text-center text-2xl font-bold text-slate-900">¿Cómo funciona?</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Para Profesionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-600">
                    <li>Crea tu perfil profesional</li>
                    <li>Publica tus servicios y precios</li>
                    <li>Gestiona tu calendario de disponibilidad</li>
                    <li>Recibe notificaciones de nuevas reservas</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register?role=professional" className="w-full">
                    <Button className="w-full">Comenzar como Profesional</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Para Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-600">
                    <li>Busca profesionales por categoría</li>
                    <li>Consulta perfiles, reseñas y precios</li>
                    <li>Reserva citas en horarios disponibles</li>
                    <li>Gestiona tus reservas desde tu cuenta</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register?role=user" className="w-full">
                    <Button className="w-full">Buscar Servicios</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Beneficios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-600">
                    <li>Sistema de reservas en tiempo real</li>
                    <li>Notificaciones automáticas</li>
                    <li>Gestión de pagos segura</li>
                    <li>Historial completo de servicios</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/about" className="w-full">
                    <Button variant="outline" className="w-full">
                      Más Información
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="rounded-lg bg-slate-900 px-4 py-12 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="mb-4 text-3xl font-bold">Comienza a reservar hoy mismo</h3>
            <p className="mb-6 text-slate-300">
              Únete a miles de usuarios que ya están disfrutando de nuestro servicio de reservas
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register?role=user">
                <Button size="lg" variant="default" className="w-full sm:w-auto">
                  Registrarme Gratis
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-slate-900 sm:w-auto"
                >
                  Explorar Profesionales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 text-slate-200">
        <div className="container mx-auto">
          <div className="grid gap-8 px-4 md:grid-cols-3">
            <div>
              <h4 className="mb-4 text-xl font-bold">BookPro</h4>
              <p className="text-slate-400">La plataforma líder para conectar profesionales con clientes.</p>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-bold">Enlaces</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-bold">Contacto</h4>
              <p className="text-slate-400">info@bookpro.com</p>
              <p className="text-slate-400">+1 234 567 890</p>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-800 px-4 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} BookPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
