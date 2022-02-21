import { Alert, Snackbar } from "@mui/material";
import Swal from 'sweetalert2/dist/sweetalert2.all.js'

export const defaultSnackStatus = {
  open: false,
  message: "Hello world",
  severity: "success"
}

export const AlertSuccess = (props) => {
  Swal.fire({
    icon: "success",
    title: "Done!",
    text: "Request successful",
    showConfirmButton: true,
    timer: 3000,
    ...props
  });
};

export const AlertFailed = (props) => {
  Swal.fire({
    icon: "error",
    title: "Error!",
    text: "Request failed",
    showConfirmButton: true,
    confirmButtonText: "Try again",
    ...props
  });
};

export const AlertWarning = (props) => {
  Swal.fire({
    icon: "warning",
    title: "Notice!",
    showConfirmButton: true,
    confirmButtonText: "Ok",
    confirmButtonColor: '#9c27b0',
    ...props
  });
};

export const ConfirmAlert = (props) => {
  return Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#9c27b0',
    cancelButtonColor: '#bababa',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel',
    ...props
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