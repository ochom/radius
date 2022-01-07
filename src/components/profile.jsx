import { Link } from "react-router-dom";

export function ProfileHeader({ student }) {
  return (
    <div className="d-flex px-3 pt-4">
      <div className="profile-image me-5">
        {student.fullName}
      </div>
      <div className="profile-info ms-5">
        <h4 className="p-0 m-0">{student.fullName}</h4>
        <p className="m-0">{student.class.level}</p>
        <div className="mt-5">
          <Link className="btn btn-outline-success" to={`/students/profile/${student.id}/edit`}>
            <i className="fa fa-edit"></i> Edit profile
          </Link>
        </div>
      </div>
    </div>
  )
}