import { useParams } from "react-router-dom"

export default function StudentsLender(props) {
  let { uid } = useParams()
  return <div>Hello from student lender : {uid}</div>
}