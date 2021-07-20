import { SubMenu } from "../../components"

const menuItems = [
    { title: "Student Roles", href: "/students/roles", icon: "bx bxs-right-arrow" },
    { title: "All students", href: "/students", icon: "bx bxs-right-arrow" },
    { title: "Profile photos", href: "/students/photos", icon: "bx bxs-right-arrow" },
    { title: "Export/Import", href: "/students/batch-processing", icon: "bx bxs-right-arrow" },
]

function Student() {
    return (
        <div>
            <SubMenu titleName="Students" titleIcon="bx bx-group" items={menuItems} />
        </div>
    )
}

export default Student