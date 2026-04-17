const THEME_KEY = 'appTheme'

export const getStoredTheme = () => {
  try {
    const storedTheme = localStorage.getItem(THEME_KEY)
    return storedTheme === 'dark' ? 'dark' : 'light'
  } catch (error) {
    return 'light'
  }
}

export const applyThemeClass = (theme) => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.classList.remove('theme-light', 'theme-dark')
  root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
}

export const setAppTheme = (theme) => {
  const safeTheme = theme === 'dark' ? 'dark' : 'light'

  try {
    localStorage.setItem(THEME_KEY, safeTheme)
  } catch (error) {
    // Ignore localStorage failures and still apply the active theme.
  }

  applyThemeClass(safeTheme)
}

export const initializeTheme = () => {
  const theme = getStoredTheme()
  applyThemeClass(theme)
  return theme
}
