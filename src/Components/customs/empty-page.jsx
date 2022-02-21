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


export const PageConstruction = ({ feature }) => {
  return (
    <Stack className="module-building">
      <Box className="svg"></Box>
      <Box>
        <Typography color="secondary" variant='h4' align="center">{feature} Feature Coming Soon</Typography>
        <Box sx={{ py: 2 }}>
          <Typography align="center">If you want to check in on the development, you are welcome to contribute.</Typography>
          <Typography align="center">Call Us: <b>+254708113456</b> or  Email Us: <b>developers@lysofts.co.ke</b></Typography>
        </Box>
      </Box>
    </Stack>
  )
}