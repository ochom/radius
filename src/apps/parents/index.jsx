import { SubMenu } from "../../components"

const menuItems = [
    { title: "All parents", href: "/parents", icon: "bx bxs-right-arrow", exact:true },
    { title: "Export/Import", href: "/parents/batch-processing", icon: "bx bxs-right-arrow" },
]

function Parents() {
    return (
        <div>
            <SubMenu titleName="Parents" titleIcon="bx bxs-user-account" items={menuItems} />
        </div>
    )
}

export default Parents