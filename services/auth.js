import api from './api'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    return decoded.exp < Date.now() / 1000
  } catch {
    return true
  }
}

export const AuthService = {
  register: async (userData) => {
    return api.post('/auth/register', userData)
  },

  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)

    Cookies.set('accessToken', data.accessToken, { expires: 0.0104 }) 
    Cookies.set('refreshToken', data.refreshToken, { expires: 7 }) 

    return data
  },

  
  getProfile: async () => {
    const token = Cookies.get('accessToken')
    if (!token || isTokenExpired(token)) {
      throw new Error('Access token is expired')
    }
    return api.get('/auth/profile')
  },

  
  logout: () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
  },
}
