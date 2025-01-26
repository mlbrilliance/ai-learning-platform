import fs from 'fs'
import path from 'path'

class Logger {
  private logs: string[] = []
  private maxLogs = 1000

  constructor() {
    this.loadLogs()
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : ''
    return `[${timestamp}] ${level}: ${message}${dataStr}`
  }

  info(message: string, data?: any) {
    const logMessage = this.formatMessage('INFO', message, data)
    console.log(logMessage)
    this.addLog(logMessage)
  }

  error(message: string, error?: any) {
    const errorData = error instanceof Error ? 
      { message: error.message, stack: error.stack } : 
      error
    const logMessage = this.formatMessage('ERROR', message, errorData)
    console.error(logMessage)
    this.addLog(logMessage)
  }

  debug(message: string, data?: any) {
    const logMessage = this.formatMessage('DEBUG', message, data)
    console.debug(logMessage)
    this.addLog(logMessage)
  }

  private addLog(message: string) {
    this.logs.push(message)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift() // Remove oldest log if we exceed maxLogs
    }
    
    // If we're in a browser environment, store logs in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_logs', JSON.stringify(this.logs))
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  getLogs(): string[] {
    return this.logs
  }

  // Load logs from localStorage if available
  loadLogs() {
    if (typeof window !== 'undefined') {
      try {
        const savedLogs = localStorage.getItem('auth_logs')
        if (savedLogs) {
          this.logs = JSON.parse(savedLogs)
        }
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  clearLogs() {
    this.logs = []
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_logs')
      } catch (e) {
        // Ignore storage errors
      }
    }
  }
}

export const logger = new Logger()
