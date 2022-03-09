import { EmailOutlined, Phone } from "@mui/icons-material";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Footer() {
  return (
    <Box id="footer">
      <Container>
        <Grid container className="footer-content" columnSpacing={12} rowSpacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant='h3'>Acme 360&#176;</Typography>
            <Typography variant='h6'>A product of Lysofts&trade;</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant='h6'>Products</Typography>
            <Stack spacing={1}>
              <Typography>Learning Management System</Typography>
              <Typography>Mentor.io&trade;</Typography>
              <Typography>Bulk SMS</Typography>
              <Typography>Payment Systems</Typography>
              <Typography>Luku&trade;</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant='h6'>Contacts</Typography>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Typography><EmailOutlined /> info@lysofts.co.ke</Typography>
              <Typography><Phone /> +254708113456</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}