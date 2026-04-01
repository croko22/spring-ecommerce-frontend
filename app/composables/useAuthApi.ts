import { mapSpringAuthError } from '~/utils/authErrors'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type PasswordResetRequestPayload = {
  email: string
}

type PasswordResetConfirmPayload = {
  token: string
  password: string
  confirmPassword: string
}

type ApiMessageResponse = {
  message?: string
  token?: string
}

export async function loginWithCredentials(payload: LoginPayload) {
  const { data, error } = await useApiFetch<ApiMessageResponse>('/auth/login', {
    method: 'POST',
    body: payload
  })

  if (error.value) {
    throw new Error(
      mapSpringAuthError(
        error.value.statusCode,
        error.value.data,
        error.value.message ?? 'No se pudo iniciar sesion.'
      )
    )
  }

  return data.value
}

export async function registerWithCredentials(payload: RegisterPayload) {
  const { data, error } = await useApiFetch<ApiMessageResponse>('/auth/register', {
    method: 'POST',
    body: payload
  })

  if (error.value) {
    throw new Error(
      mapSpringAuthError(
        error.value.statusCode,
        error.value.data,
        error.value.message ?? 'No se pudo registrar el usuario.'
      )
    )
  }

  return data.value
}

export async function requestPasswordReset(payload: PasswordResetRequestPayload) {
  const { data, error } = await useApiFetch<ApiMessageResponse>('/auth/password-reset/request', {
    method: 'POST',
    body: payload
  })

  if (error.value) {
    throw new Error(
      mapSpringAuthError(
        error.value.statusCode,
        error.value.data,
        error.value.message ?? 'No se pudo solicitar el reseteo de contrasena.'
      )
    )
  }

  return data.value
}

export async function confirmPasswordReset(payload: PasswordResetConfirmPayload) {
  const { data, error } = await useApiFetch<ApiMessageResponse>('/auth/password-reset/confirm', {
    method: 'POST',
    body: payload
  })

  if (error.value) {
    throw new Error(
      mapSpringAuthError(
        error.value.statusCode,
        error.value.data,
        error.value.message ?? 'No se pudo actualizar la contrasena.'
      )
    )
  }

  return data.value
}
