import Swal from "sweetalert2";

export const AlertSuccess = (message: string) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const AlertFailed = (message: any) => {
  Swal.fire({
    icon: "error",
    title: message,
    showConfirmButton: true,
    confirmButtonText: "Try again",
  });
};

export const AlertWarning = (message: any) => {
  Swal.fire({
    icon: "warning",
    title: message,
    showConfirmButton: true,
    confirmButtonText: "Ok",
  });
};
