import { useEffect } from 'react'

export const Notification = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    base: {
      padding: '12px 20px',
      borderRadius: '10px',
      marginBottom: '16px',
      color: 'white',
      fontWeight: 'bold',
    },
    error: {
      backgroundColor: '#e74c3c',
    },
    success: {
      backgroundColor: '#2ecc71',
    },
    warning: {
      backgroundColor: '#f39c12',
    },
  }

  return (
    <div style={{ ...styles.base, ...styles[type] }}>
      {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: '10px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontWeight: 'bold',
          float: 'right',
          cursor: 'pointer',
        }}
      >
        ×
      </button>
    </div>
  )
}
