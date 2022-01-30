import { SubMenu } from "../customs"

const menuItems = [
    { title: "Exams", href: "/academics", icon: "bx bxs-right-arrow", exact: true },
    { title: "Exam Type", href: "/academics/exam-types", icon: "bx bxs-right-arrow" },
    { title: "Subject Groups", href: "/academics/subject-groups", icon: "bx bxs-right-arrow" },
    { title: "Subjects", href: "/academics/subjects", icon: "bx bxs-right-arrow" },
    { title: "Grades", href: "/academics/grades", icon: "bx bxs-right-arrow" },
    { title: "Subject Grading", href: "/academics/grades", icon: "bx bxs-right-arrow" },
    { title: "Exam Grading", href: "/academics/grades", icon: "bx bxs-right-arrow" },
]

function Academics() {
    return (
        <div>
            <SubMenu titleName="Academics" titleIcon="bx bxs-graduation" items={menuItems} />
        </div>
    )
}

export default Academics