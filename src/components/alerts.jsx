import { Alert, Snackbar } from "@mui/material";
import Swal from "sweetalert2";

export const AlertSuccess = (message) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const AlertFailed = (message) => {
  Swal.fire({
    icon: "error",
    title: message,
    showConfirmButton: true,
    confirmButtonText: "Try again",
  });
};

export const AlertWarning = (message) => {
  Swal.fire({
    icon: "warning",
    title: message,
    showConfirmButton: true,
    confirmButtonText: "Ok",
  });
};

export const ConfirmAlert = () => {
  return Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  })
}


export const CustomSnackBar = (props) => {
  const { open, severity, message, onClose } = props
  return (
    <Snackbar open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={6000}
      onClose={onClose}>
      <Alert severity={severity} sx={{ width: '100%' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}