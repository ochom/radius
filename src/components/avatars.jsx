import Avatar, { genConfig } from 'react-nice-avatar'


export const UserAvatar = ({ sex }) => {
  let avatarConfig = genConfig({
    shirtStyle: "polo",
    hatStyle: "none",
    bgColor: "linear-gradient(45deg, #1729ff 0%, #ff56f7 100%)"
  })


  return <Avatar {...avatarConfig} className="user-thumbnail" sex={sex === "male" ? "man" : "woman"} hairStyle={sex === "male" ? "thick" : "womanLong"} />
}