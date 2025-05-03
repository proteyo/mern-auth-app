export const handleApiError = (error) => {
    if (error.response) {
      const { status, data } = error.response
  
      switch (status) {
        case 400:
          return 'Неверные данные. Проверьте форму.'
        case 401:
          return 'Сессия истекла. Войдите заново.'
        case 403:
          return 'Нет доступа к ресурсу.'
        case 404:
          return 'Ресурс не найден.'
        case 500:
          return 'Ошибка сервера. Попробуйте позже.'
        default:
          return data.message || 'Неизвестная ошибка'
      }
    } else if (error.request) {
      return 'Нет ответа от сервера. Проверьте подключение.'
    } else {
      return 'Ошибка запроса.'
    }
  }
  