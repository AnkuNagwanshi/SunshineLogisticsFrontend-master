export interface LoginInputs {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterInputs {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    name: string
    email: string
  }
}

export interface JwtPayload {
  id: number
  email: string
  iat: number
  exp: number
}
