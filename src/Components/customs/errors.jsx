import { Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"

export const PageErrorAlert = ({ message }) => {
  return (
    <Stack className="network-error">
      <Box className="svg"></Box>
      <Box>
        <Typography color="secondary" variant='h4' align="center">Oops!</Typography>
        <Typography align="center">{message}</Typography>
      </Box>
    </Stack>
  )
}