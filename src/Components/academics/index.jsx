import { PageBody, SubMenu } from "../customs"
import { PageConstruction } from "../customs/empty-page"

const menuItems = [
    { title: "Exams", href: "/examination", icon: "bx bxs-right-arrow", exact: true },
    { title: "Exam Type", href: "/examination/exam-types", icon: "bx bxs-right-arrow" },
    { title: "Subject Groups", href: "/examination/subject-groups", icon: "bx bxs-right-arrow" },
    { title: "Subjects", href: "/examination/subjects", icon: "bx bxs-right-arrow" },
    { title: "Grades", href: "/examination/grades", icon: "bx bxs-right-arrow" },
    { title: "Subject Grading", href: "/examination/grades", icon: "bx bxs-right-arrow" },
    { title: "Exam Grading", href: "/examination/grades", icon: "bx bxs-right-arrow" },
]

function Examination() {
    return (
        <>
            <SubMenu titleName="Examination" titleIcon="bx bxs-graduation" items={menuItems} />
            <PageBody>
                <PageConstruction feature='Examination' />
            </PageBody>
        </>
    )
}

export default Examination