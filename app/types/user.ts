export type UserProfile = {
  id: string
  name: string
  email: string
  role: string
  phone: string
  address: string
}

export type UpdateUserProfileRequest = {
  name: string
  phone: string
  address: string
}
