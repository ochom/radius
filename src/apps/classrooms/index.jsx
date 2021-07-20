import { SubMenu } from "../../components"

const menuItems = [
    { title: "All classes", href: "/classes", icon: "bx bxs-right-arrow" },
    { title: "Export/Import", href: "/classes/batch-processing", icon: "bx bxs-right-arrow" },
]

function Classes() {
    return (
        <div>
            <SubMenu titleName="Classes" titleIcon="bx bxs-school" items={menuItems} />
        </div>
    )
}

export default Classes