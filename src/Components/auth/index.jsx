import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import LoginForm from "./login_form";
import PricingForm from "./pricing";
import RegistrationForm from "./registration_form";
import SchoolProfile from "./school_profile";

const pages = [
  { title: 'About', href: '#about' },
  { title: 'Pricing', href: '#pricing' },
  { title: 'Contact Us', href: '#contacts' }
];

const Auth = () => {
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: 'white' }}>
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { md: 'flex' }, color: '#9c27b0' }}
            >
              <Typography sx={{ fontSize: '1.5rem', mr: 1 }}>
                <i className="bx bxl-sketch" ></i>
              </Typography>
              Radius 360&#176;
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', ml: '10rem' }}>
              {pages.map((page) =>
                <Button
                  key={page.title}
                  href={page.href}
                  sx={{ my: 2, mr: 3, color: '#9c27b0', display: 'block' }}
                >
                  {page.title}
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <section className="landing-section py-5">
        <Container>
          <div className="row col-12">
            <div className="col-md-6 col-lg-7">
              <div className="about">
                <div>
                  <Typography variant="h4" color="GrayText">Welcome to</Typography>
                  <Typography color="secondary" variant="h1" sx={{ mb: 4, fontSize: "3rem", fontWeight: 700 }}>Radius 360&#176;</Typography>
                </div>
                <Typography variant="body2" color="grey"
                  sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
                  Manage Examinations, Finances, Students and Library.
                </Typography>
                <Typography color="secondary" variant="h4" mt={1}>Anywhere, Anytime</Typography>
              </div>
            </div>
            <div className="col-md-6 col-lg-5">
              <LoginForm />
            </div>
          </div>
        </Container>
      </section>
      <section id="registration" className="registration-section">
        <Container>
          <PricingForm />
          <SchoolProfile />
          <RegistrationForm />
        </Container>
      </section>
      <section id="contacts" className="registration-section">
        <Container>
          <PricingForm />
          <SchoolProfile />
          <RegistrationForm />
        </Container>
      </section>
      <section id="footer" className="footer-section">
        <Container>

        </Container>
      </section>
    </Box>

  );
};

export default Auth;
