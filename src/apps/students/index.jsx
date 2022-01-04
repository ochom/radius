import { SubMenu } from "../../components"

const menuItems = [
  { title: "All students", href: "/students", icon: "bx bxs-group", exact: true },
  { title: "Create New Student", href: "/students/new", icon: "bx bx-plus-medical", },
  { title: "Student Roles", href: "/students/roles", icon: "bx bx-list-ul" },
  { title: "Import Students", href: "/students/import", icon: "bx bxs-file-import" },
  { title: "Export List", href: "/students/export", icon: "bx bxs-file-export" },
]

function Student() {
  return (
    <div>
      <SubMenu titleName="Students" titleIcon="bx bx-group" items={menuItems} />
    </div>
  )
}

export default Student