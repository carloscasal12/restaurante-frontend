import { Alert, Box, CircularProgress, Typography } from '@mui/material'

export function LoadingState({ label }) {
  return (
    <Box className="status-block">
      <CircularProgress color="primary" />
      <Typography variant="body1">{label || 'Cargando datos...'}</Typography>
    </Box>
  )
}

export function ErrorState({ message }) {
  return (
    <Alert severity="error" className="status-block">
      {message || 'No se han podido cargar los datos.'}
    </Alert>
  )
}
