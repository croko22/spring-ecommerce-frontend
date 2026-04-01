type MaybeRecord = Record<string, unknown>

function firstText(value: unknown): string | null {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return value.trim() || null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const next = firstText(item)

      if (next) {
        return next
      }
    }
  }

  if (typeof value === 'object') {
    for (const current of Object.values(value as MaybeRecord)) {
      const next = firstText(current)

      if (next) {
        return next
      }
    }
  }

  return null
}

export function mapSpringAuthError(status: number | undefined, data: unknown, fallback: string): string {
  const payload = (data && typeof data === 'object' ? data : {}) as MaybeRecord
  const raw = firstText(payload.message) ?? firstText(payload.error) ?? firstText(payload.errors)

  if (status === 401) {
    return 'Credenciales invalidas o sesion expirada.'
  }

  if (status === 403) {
    return 'No tienes permisos para realizar esta accion.'
  }

  if (status === 404) {
    return 'No encontramos el recurso solicitado.'
  }

  if (status === 409) {
    return raw ?? 'El recurso ya existe o entra en conflicto con otro dato.'
  }

  if (status === 422 || status === 400) {
    if (raw) {
      if (raw.toLowerCase().includes('password')) {
        return 'La contrasena no cumple los requisitos solicitados.'
      }

      if (raw.toLowerCase().includes('email')) {
        return 'Revisa el formato del email o usa uno diferente.'
      }
    }

    return raw ?? 'Hay errores de validacion en el formulario.'
  }

  if (status === 500) {
    return 'El servidor tuvo un problema. Intentalo de nuevo en unos minutos.'
  }

  return raw ?? fallback
}
