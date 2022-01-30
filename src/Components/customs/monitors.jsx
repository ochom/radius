import { NoBorderSpinner } from "react-fancy-loader"


export const CustomLoader = () => {
  return <div className="py-5 d-flex justify-content-center"><NoBorderSpinner size={60} color="#4e0c8b" stroke={3} duration={1000} /></div>
}