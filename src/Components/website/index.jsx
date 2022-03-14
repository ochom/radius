import { EmailOutlined, Phone } from "@mui/icons-material";
import { AppBar, Button, Card, Container, Grid, Stack, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Footer from "./footer";
import LoginForm from "./login";
import RegistrationForm from "./registration";

const pages = [
  { title: 'About', href: '#about' },
  { title: 'Pricing', href: '#pricing' },
  { title: 'Contact Us', href: '#contacts' }
];

const Website = () => {
  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: 'white' }}>
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: 'flex', flexGrow: 1, color: '#9c27b0' }}
            >
              <Typography sx={{ fontSize: '1.5rem', mr: 1, }}>
                <i className="bx bxl-sketch" ></i>
              </Typography>
              Acme 360&#176;
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {pages.map((page) =>
                <Button
                  key={page.title}
                  href={page.href}
                  color="secondary"
                  sx={{ my: 2, mr: 2, display: 'block' }}
                >
                  {page.title}
                </Button>
              )}
            </Box>
            <Box>
              <Button color="secondary" className="no-transform" sx={{ mr: 3 }} href="#login">Sign in</Button>
              <Button variant="outlined" color="secondary" className="no-transform" sx={{ mr: 3 }} href="mailto:sales@lysofts.co.ke?subject=Acme 360 Sales&body=I would like to know more about Acme Systems">Talk to sales</Button>
              <Button variant="contained" color="secondary" className="no-transform" href="#register">Try for free</Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <section id="about"></section>
      <section className="landing-section" id="login">
        <Container>
          <Box className="row col-12">
            <Box className="col-md-6 col-lg-7">
              <Box className="about">
                <Box>
                  <Typography variant="h4" color="GrayText">Welcome to</Typography>
                  <Typography color="secondary" variant="h1" sx={{ mb: 4, fontSize: "3rem", fontWeight: 700 }}>Acme 360&#176;</Typography>
                </Box>
                <Typography variant="body2" color="grey"
                  sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
                  Manage Examinations, Finances, Students and Library.
                </Typography>
                <Typography color="secondary" variant="h4" mt={1}>Anywhere, Anytime</Typography>
              </Box>
            </Box>
            <Box className="col-md-6 col-lg-5">
              <LoginForm />
            </Box>
          </Box>
        </Container>
      </section>
      <section id="register" className="py-5">
        <Container>
          <Typography variant="h3" align="center">Get Started</Typography>
          <RegistrationForm />
        </Container>
      </section>
      <section id="contacts" className="py-5">
        <Container>
          <Typography variant="h3" align="center">Contact Us</Typography>
          <Typography variant="h5" align="center">You can reach the support team 24/7</Typography>
          <Stack direction='row' spacing={3} justifyContent='center'
            sx={{ mt: 8 }}>
            <Card sx={{ py: 5, px: 10 }}>
              <Typography><Phone /> +254708113456</Typography>
            </Card>
            <Card sx={{ py: 5, px: 10 }}>
              <Typography><EmailOutlined /> support@lysofts.co.ke</Typography>
            </Card>
          </Stack>
        </Container>
      </section>
      <section id="pricing" className="py-5">
        <Container>
          <Stack spacing={5}>
            <Typography variant="h3" align="center">Pricing</Typography>
            <Typography variant="h5" align="center">Acme 360&#176; is a Free software solution</Typography>
          </Stack>
        </Container>
      </section>
      <section>
        <Footer />
      </section>
    </Box >

  );
};

export default Website;
