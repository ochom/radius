import { SubMenu } from "../../components"

const menuItems = [
    { title: "Roles", href: "/staff/roles", icon: "bx bxs-right-arrow" },
    { title: "All staff", href: "/staff", icon: "bx bxs-right-arrow" },
    { title: "Teaching staff", href: "/staff?type=teaching", icon: "bx bxs-right-arrow" },
    { title: "Non-Teaching staff", href: "/staff?type=non-teaching", icon: "bx bxs-right-arrow" },
    { title: "Batch processing", href: "/staff/batch-processing", icon: "bx bxs-right-arrow" },
]

function Staff() {
    return (
        <div>
            <SubMenu titleName="Staff" titleIcon="bx bx-user" items={menuItems} />
        </div>
    )
}

export default Staff