import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { fetchJson, API_BASES } from '../api'
import { ErrorState, LoadingState } from '../components/Status'

function HomePage() {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    async function loadRestaurants() {
      try {
        setLoading(true)
        const data = await fetchJson('/restaurants')
        if (isActive) {
          setRestaurants(data)
          setError('')
        }
      } catch (err) {
        if (isActive) {
          setError(err.message)
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadRestaurants()
    return () => {
      isActive = false
    }
  }, [])

  const columns = useMemo(
    () => [
      { field: 'restaurante', headerName: 'Restaurante', flex: 1, minWidth: 180 },
      { field: 'barrio', headerName: 'Barrio', flex: 1, minWidth: 140 },
      {
        field: 'cta',
        headerName: 'Detalle',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(`/restaurants/${params.row.restauranteID}`)}
          >
            Ver pedidos
          </Button>
        ),
      },
    ],
    [navigate]
  )

  return (
    <Box className="page">
      <Container maxWidth="lg" className="page-inner">
        <Stack spacing={4}>
          <Card className="hero-card">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="overline" color="secondary.main">
                  Consumo de API externa
                </Typography>
                <Typography variant="h2">Mapa de Restaurantes</Typography>
                <Typography variant="body1" color="text.secondary">
                  Selecciona un restaurante para explorar sus platos, pedidos y
                  clientes. Datos cargados en tiempo real desde {API_BASES[0]}.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="React + Vite" />
                  <Chip label="React Router" />
                  <Chip label="MUI DataGrid" />
                  <Chip label="Async Fetch" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4">Restaurantes</Typography>
                {loading && <LoadingState label="Cargando restaurantes..." />}
                {!loading && error && <ErrorState message={error} />}
                {!loading && !error && (
                  <div className="data-grid">
                    <DataGrid
                      rows={restaurants}
                      columns={columns}
                      autoHeight
                      pageSizeOptions={[5, 10]}
                      disableRowSelectionOnClick
                      getRowId={(row) => row.restauranteID}
                    />
                  </div>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}

export default HomePage
