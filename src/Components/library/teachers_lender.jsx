import { useParams } from "react-router-dom"

export default function TeachersLender(props) {
  let { uid } = useParams()
  return <div>Hello from staff lender : {uid}</div>
}