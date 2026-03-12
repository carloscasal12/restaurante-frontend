import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DataGrid } from '@mui/x-data-grid'
import { fetchJson } from '../api'
import { ErrorState, LoadingState } from '../components/Status'

function RestaurantPage() {
  const { id } = useParams()
  const restaurantId = Number(id)
  const [restaurant, setRestaurant] = useState(null)
  const [dishes, setDishes] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [orderDishes, setOrderDishes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    async function loadBaseData() {
      try {
        setLoading(true)
        const [restaurantsData, dishesData, ordersData, customersData] =
          await Promise.all([
            fetchJson('/restaurants'),
            fetchJson('/dishes'),
            fetchJson('/orders'),
            fetchJson('/customers'),
          ])

        if (!isActive) return

        const selected = restaurantsData.find(
          (item) => item.restauranteID === restaurantId
        )
        setRestaurant(selected || null)
        setDishes(
          dishesData.filter((item) => item.restauranteID === restaurantId)
        )
        setOrders(
          ordersData.filter((item) => item.restauranteID === restaurantId)
        )
        setCustomers(customersData)
        setError('')
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

    loadBaseData()
    return () => {
      isActive = false
    }
  }, [restaurantId])

  useEffect(() => {
    let isActive = true
    async function loadOrderDishes() {
      if (!orders.length) {
        setOrderDishes({})
        return
      }

      try {
        const entries = await Promise.all(
          orders.map(async (order) => {
            const data = await fetchJson(`/order/${order.pedidoID}/dishes`)
            return [order.pedidoID, data]
          })
        )

        if (isActive) {
          setOrderDishes(Object.fromEntries(entries))
        }
      } catch (err) {
        if (isActive) {
          setError(err.message)
        }
      }
    }

    loadOrderDishes()
    return () => {
      isActive = false
    }
  }, [orders])

  const customersMap = useMemo(() => {
    return customers.reduce((acc, item) => {
      acc[item.clienteID] = item
      return acc
    }, {})
  }, [customers])

  const ordersWithCustomer = useMemo(() => {
    return orders.map((order) => {
      const customer = customersMap[order.clienteID]
      const fullName = customer
        ? `${customer.nombre} ${customer.apellido1} ${customer.apellido2}`
        : 'Sin datos'
      const dishCount = orderDishes[order.pedidoID]?.length || 0
      return {
        ...order,
        clienteNombre: fullName,
        poblacion: customer?.poblacion || 'N/D',
        platos: dishCount,
      }
    })
  }, [orders, customersMap, orderDishes])

  const dishColumns = useMemo(
    () => [
      { field: 'plato', headerName: 'Plato', flex: 1, minWidth: 200 },
      {
        field: 'descripcion',
        headerName: 'Descripción',
        flex: 1.2,
        minWidth: 220,
      },
      {
        field: 'precio',
        headerName: 'Precio',
        width: 120,
        valueFormatter: (value) => `€ ${value ?? 'N/D'}`,
      },
    ],
    []
  )

  const orderColumns = useMemo(
    () => [
      { field: 'pedidoID', headerName: 'Pedido', width: 110 },
      { field: 'fecha', headerName: 'Fecha', width: 130 },
      { field: 'clienteNombre', headerName: 'Cliente', flex: 1, minWidth: 180 },
      { field: 'poblacion', headerName: 'Población', width: 140 },
      { field: 'platos', headerName: 'Platos', width: 110 },
    ],
    []
  )

  return (
    <Box className="page">
      <Container maxWidth="lg" className="page-inner">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
            <Typography component={Link} to="/" className="back-link">
              ← Volver al listado
            </Typography>
            <Chip label={`Restaurante #${restaurantId}`} color="secondary" />
          </Stack>

          {loading && <LoadingState label="Cargando información..." />}
          {!loading && error && <ErrorState message={error} />}

          {!loading && !error && restaurant && (
            <>
              <Card className="hero-card">
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="overline" color="secondary.main">
                      Detalle del restaurante
                    </Typography>
                    <Typography variant="h2">{restaurant.restaurante}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      Barrio: {restaurant.barrio}
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Chip label={`${dishes.length} platos`} />
                      <Chip label={`${orders.length} pedidos`} />
                      <Chip label={`${customers.length} clientes`} />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h4">Platos del restaurante</Typography>
                    <div className="data-grid">
                      <DataGrid
                        rows={dishes}
                        columns={dishColumns}
                        autoHeight
                        pageSizeOptions={[5, 10]}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.platoID}
                      />
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h4">Pedidos y clientes</Typography>
                    <div className="data-grid">
                      <DataGrid
                        rows={ordersWithCustomer}
                        columns={orderColumns}
                        autoHeight
                        pageSizeOptions={[5, 10]}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.pedidoID}
                      />
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h4">
                      Detalle de platos por pedido
                    </Typography>
                    <Divider />
                    {orders.map((order) => (
                      <Accordion key={order.pedidoID} className="order-accordion">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Typography variant="subtitle1">
                              Pedido #{order.pedidoID}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.fecha}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {customersMap[order.clienteID]
                                ? `${customersMap[order.clienteID].nombre} ${
                                    customersMap[order.clienteID].apellido1
                                  } ${customersMap[order.clienteID].apellido2}`
                                : 'Sin datos'}
                            </Typography>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={1}>
                            {(orderDishes[order.pedidoID] || []).map((dish) => (
                              <Box key={`${order.pedidoID}-${dish.platoID}`}>
                                <Typography variant="subtitle2">
                                  {dish.plato}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Cantidad: {dish.cantidad} · € {dish.precio}
                                </Typography>
                              </Box>
                            ))}
                            {!orderDishes[order.pedidoID]?.length && (
                              <Typography variant="body2" color="text.secondary">
                                No hay platos registrados.
                              </Typography>
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </>
          )}

          {!loading && !error && !restaurant && (
            <ErrorState message="No se encontró el restaurante solicitado." />
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export default RestaurantPage
