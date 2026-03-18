'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { user, tokens } = response.data
      // Store user info (token is in httpOnly cookie)
      login({
        id: user.id,
        email: user.email,
        roles: user.roles || ['student']
      })
      // Invalidate any existing queries
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      // Navigate to dashboard
      router.push('/dashboard')
    },
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      router.push('/login')
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout()
      router.push('/login')
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authAPI.me,
    retry: false,
  })
}
