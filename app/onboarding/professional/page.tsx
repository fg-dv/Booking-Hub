"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/multi-select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { supabaseClient } from "@/lib/supabase/client"

// Categorías disponibles
const availableCategories = [
  { label: "Psicología", value: "Psicología" },
  { label: "Fisioterapia", value: "Fisioterapia" },
  { label: "Nutrición", value: "Nutrición" },
  { label: "Odontología", value: "Odontología" },
  { label: "Dermatología", value: "Dermatología" },
  { label: "Entrenamiento personal", value: "Entrenamiento personal" },
  { label: "Asesoría legal", value: "Asesoría legal" },
  { label: "Coaching", value: "Coaching" },
]

export default function ProfessionalOnboarding() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    specialty: "",
    description: "",
    education: "",
    pricePerHour: "",
    categories: [] as string[],
    location: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoriesChange = (selectedCategories: string[]) => {
    setFormData((prev) => ({ ...prev, categories: selectedCategories }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para completar tu perfil",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Update profile with location and phone
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .update({
          location: formData.location,
          phone: formData.phone,
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Create professional record
      const { error: professionalError } = await supabaseClient.from("professionals").insert({
        user_id: user.id,
        specialty: formData.specialty,
        description: formData.description,
        education: formData.education.split("\n").filter((line) => line.trim() !== ""),
        price_per_hour: Number.parseFloat(formData.pricePerHour),
        categories: formData.categories,
      })

      if (professionalError) throw professionalError

      toast({
        title: "Perfil completado",
        description: "Tu perfil profesional ha sido creado exitosamente",
      })

      router.push("/dashboard/professional")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al crear tu perfil profesional",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Completa tu perfil profesional</CardTitle>
          <CardDescription>
            Proporciona información sobre tus servicios para que los clientes puedan encontrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  placeholder="Ej: Psicólogo Clínico"
                  required
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerHour">Precio por hora (€)</Label>
                <Input
                  id="pricePerHour"
                  name="pricePerHour"
                  type="number"
                  placeholder="Ej: 60"
                  required
                  value={formData.pricePerHour}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono de contacto</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Ej: +34 612 345 678"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Ej: Madrid, España"
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Categorías</Label>
              <MultiSelect
                options={availableCategories}
                selected={formData.categories}
                onChange={handleCategoriesChange}
                placeholder="Selecciona categorías"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe tu experiencia y servicios..."
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Formación académica</Label>
              <Textarea
                id="education"
                name="education"
                placeholder="Ingresa tu formación (una por línea)..."
                required
                value={formData.education}
                onChange={handleChange}
                rows={3}
              />
              <p className="text-xs text-slate-500">Ingresa cada título en una línea separada</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Completar perfil"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-600">
            Podrás editar esta información más adelante desde tu panel de control
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
