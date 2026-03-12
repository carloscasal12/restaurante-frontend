import { HashRouter, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { appTheme } from './theme'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants/:id" element={<RestaurantPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
