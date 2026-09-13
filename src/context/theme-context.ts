import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'portfolio-theme'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

/**
 * Lives in its own module (no components) so both the provider and the hook can
 * import it without breaking React Fast Refresh, which requires a file to
 * export either only components or only non-components.
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null)
