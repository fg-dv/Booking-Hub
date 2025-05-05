"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, Star, Calendar, Clock } from "lucide-react"

// Datos de ejemplo para el marketplace
const professionals = [
  {
    id: 1,
    name: "Dr. Juan Pérez",
    specialty: "Psicólogo Clínico",
    rating: 4.8,
    reviews: 24,
    location: "Madrid, España",
    price: 80,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
    categories: ["Psicología", "Terapia"],
  },
  {
    id: 2,
    name: "Dra. Ana García",
    specialty: "Fisioterapeuta",
    rating: 4.9,
    reviews: 36,
    location: "Barcelona, España",
    price: 65,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
    categories: ["Fisioterapia", "Rehabilitación"],
  },
  {
    id: 3,
    name: "Dr. Carlos Rodríguez",
    specialty: "Nutricionista",
    rating: 4.7,
    reviews: 18,
    location: "Valencia, España",
    price: 70,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
    categories: ["Nutrición", "Dietética"],
  },
  {
    id: 4,
    name: "Dra. Laura Martínez",
    specialty: "Dentista",
    rating: 4.6,
    reviews: 42,
    location: "Sevilla, España",
    price: 90,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
    categories: ["Odontología", "Salud dental"],
  },
  {
    id: 5,
    name: "Dr. Miguel Sánchez",
    specialty: "Dermatólogo",
    rating: 4.5,
    reviews: 31,
    location: "Madrid, España",
    price: 95,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
    categories: ["Dermatología", "Estética"],
  },
  {
    id: 6,
    name: "Dra. Sofía López",
    specialty: "Psicóloga Infantil",
    rating: 4.9,
    reviews: 27,
    location: "Barcelona, España",
    price: 75,
    available: true,
    image: "/placeholder.svg?height=80&width=80",
    categories: ["Psicología", "Infantil"],
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

// Ubicaciones
const locations = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga"]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 150])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")

  // Filtrar profesionales según los criterios
  const filteredProfessionals = professionals.filter((professional) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por categorías
    const matchesCategory =
      selectedCategories.length === 0 ||
      professional.categories.some((category) => selectedCategories.includes(category))

    // Filtro por ubicación
    const matchesLocation = selectedLocation === "" || professional.location.includes(selectedLocation)

    // Filtro por rango de precio
    const matchesPrice = professional.price >= priceRange[0] && professional.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold">
            BookPro
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="mb-6 px-4">
          <h1 className="text-2xl font-bold">Buscar Profesionales</h1>
          <p className="text-slate-600">Encuentra el profesional perfecto para tus necesidades</p>
        </div>

        <div className="grid gap-6 px-4 md:grid-cols-4">
          {/* Filtros */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium">Búsqueda</h3>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button size="icon" variant="ghost">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Ubicación</h3>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las ubicaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las ubicaciones</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Categorías</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Rango de precio</h3>
                  <div className="space-y-2">
                    <Slider
                      defaultValue={[0, 150]}
                      max={150}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex items-center justify-between">
                      <span>{priceRange[0]}€</span>
                      <span>{priceRange[1]}€</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">{filteredProfessionals.length} profesionales encontrados</p>
              <Select defaultValue="rating">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                  <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals.map((professional) => (
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
                        <span>{professional.price}€/sesión</span>
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

            {filteredProfessionals.length === 0 && (
              <div className="mt-8 rounded-lg border border-slate-200 p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No se encontraron resultados</h3>
                <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
