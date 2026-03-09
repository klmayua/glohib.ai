'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { tokens } = response.data
      login({ id: tokens.user_id, email: response.data.email, roles: [] }, tokens.access_token)
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
