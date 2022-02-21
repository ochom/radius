import { Box } from "@mui/system";

export default function Footer() {
  return <Box sx={{ position: 'fixed', bottom: "1rem", right: "1rem" }}>&copy; {new Date().getFullYear()} Lysofts Ke</Box>
}