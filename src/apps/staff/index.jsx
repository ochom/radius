import { Route } from "react-router-dom"
import { PageBody, SubMenu } from "../../components"
import AllStaff from "./all_staff"
import StaffPhotos from "./photos"
import StaffRoles from "./staff_roles"

const menuItems = [
    { title: "Roles", href: "/staff/roles", icon: "bx bxs-right-arrow" },
    { title: "All staff", href: "/staff", icon: "bx bxs-right-arrow", exact: true },
    { title: "Teaching staff", href: "/staff/teaching", icon: "bx bxs-right-arrow" },
    { title: "Non-Teaching staff", href: "/staff/non-teaching", icon: "bx bxs-right-arrow" },
    { title: "Profile photos", href: "/staff/photos", icon: "bx bxs-right-arrow" },
]

function Staff() {
    return (
        <div>
            <SubMenu titleName="Staff" titleIcon="bx bx-user" items={menuItems} />
            <PageBody>
                <Route
                    path="/staff"
                    render={({ match: { url } }) => (
                        <>
                            <Route path={`${url}`} component={AllStaff} exact />
                            <Route path={`${url}/roles`} component={StaffRoles} />
                            <Route path={`${url}/photos`} component={StaffPhotos} exact />
                        </>
                    )}
                />
            </PageBody>
        </div>
    )
}

export default Staff