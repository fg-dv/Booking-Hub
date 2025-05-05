"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { supabaseClient } from "@/lib/supabase/client"
import type { Tables } from "@/lib/supabase/database.types"

type Profile = Tables<"profiles">

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string, data: { full_name: string; role: "user" | "professional" }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)

      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession()

      if (error) {
        console.error("Error fetching session:", error)
        setIsLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(profile)
      }

      setIsLoading(false)
    }

    fetchSession()

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(profile)
      } else {
        setProfile(null)
      }

      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signUp = async (
    email: string,
    password: string,
    data: { full_name: string; role: "user" | "professional" },
  ) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: data.full_name,
        },
      },
    })

    if (error) {
      throw error
    }

    // Create profile
    const { error: profileError } = await supabaseClient.from("profiles").insert({
      id: (await supabaseClient.auth.getUser()).data.user!.id,
      full_name: data.full_name,
      role: data.role,
    })

    if (profileError) {
      throw profileError
    }

    // If professional, create professional record
    if (data.role === "professional") {
      router.push("/onboarding/professional")
    } else {
      router.push("/dashboard/user")
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    // Get profile to determine role and redirect accordingly
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", (await supabaseClient.auth.getUser()).data.user!.id)
      .single()

    if (profile?.role === "professional") {
      router.push("/dashboard/professional")
    } else {
      router.push("/dashboard/user")
    }
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()

    if (error) {
      throw error
    }

    router.push("/")
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
