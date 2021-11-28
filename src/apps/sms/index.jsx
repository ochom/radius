import { PageBody, SubMenu } from "../../components"

const menuItems = [
    { title: "Compose", href: "/sms", icon: "bx bxs-right-arrow", exact: true },
    { title: "Outbox", href: "/sms/outbox", icon: "bx bxs-right-arrow" },
    { title: "Contact groups", href: "/sms/groups", icon: "bx bxs-right-arrow" },
    { title: "Contacts", href: "/sms/contacts", icon: "bx bxs-right-arrow" },
    { title: "SMS Templates", href: "/sms/templates", icon: "bx bxs-right-arrow" },
    { title: "SMS Preferences", href: "/sms/preferences", icon: "bx bxs-right-arrow" },
]

const SMS = () => {
  return (
    <>
      <SubMenu titleName="SMS" titleIcon="bx bx-chat" items={menuItems} />
      <PageBody>Hello world</PageBody>
    </>
  );
};

export default SMS;
