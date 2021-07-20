import { SubMenu } from "../../components"

const menuItems = [
    { title: "Dashboard", href: "/library", icon: "bx bxs-right-arrow" , exact:true },
    { title: "Books", href: "/library/books", icon: "bx bxs-right-arrow" },
    { title: "Borrows", href: "/library/borrrows", icon: "bx bxs-right-arrow" },
    { title: "Staff borrows", href: "/library/borrows-staff", icon: "bx bxs-right-arrow" },
    { title: "Student borrows", href: "/library/borrows-students", icon: "bx bxs-right-arrow" },
    { title: "Authors", href: "/library/authors", icon: "bx bxs-right-arrow" },
]

function Library() {
    return (
        <div>
            <SubMenu titleName="Library" titleIcon="bx bx-book-open" items={menuItems} />
        </div>
    )
}

export default Library