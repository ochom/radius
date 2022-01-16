import { Alert, Avatar, Box, Card, Divider, Paper, Rating, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Service } from '../../API/service';
import { CustomLoader } from "../../components/monitors"
import { Adjust, Apartment, Assessment, EmojiEvents, EmojiEventsOutlined, Event, Gavel, Group, Info, Receipt, School, SchoolOutlined, Wc } from "@mui/icons-material";
import { panelProps, TabPanel } from "../../components/tabs";
import { Link } from "react-router-dom";

const StudentDetails = (props) => {
  const [student, setStudent] = useState(false);
  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)

  const selectTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    let query = {
      query: `query students($id:ID!){
        student: getStudent(id:$id){
          id
          fullName
          dateOfBirth
          dateOfAdmission
          gender
          admissionNumber
          nationalID
          age
          active
          homeAddress
          class{
            level
            stream
          }
        }
      }`,
      variables: {
        "id": props.match.params.uid
      }
    }
    new Service().getData(query).then((res) => {
      setStudent(res?.student || null)
      setLoading(false)
    });
  }, [props]);

  if (loading) {
    return <CustomLoader />
  }

  if (!student) {
    return <Paper sx={{ px: 5, py: 2 }} className="col-6 mx-auto">
      <div className="py-5 d-flex justify-content-center"><Alert severity="warning">Student not found</Alert></div>
    </Paper>
  }

  return (
    <Card>
      <Box sx={{ p: 3, display: 'flex' }} >
        <Avatar variant="rounded" src="avatar1.jpg" sx={{ width: "10rem", height: "10rem" }} />
        <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
          <Typography fontWeight={700}>{student.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            <Apartment sx={{ fontSize: "1.2rem" }} color="secondary" /> {student.class.level} {student.class.stream}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {student.gender}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Event sx={{ fontSize: "1.2rem" }} color="secondary" />  {student.age} yrs old
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Adjust sx={{ fontSize: "1.2rem" }} color={student.active ? "success" : "disabled"} />  {student.active ? "Active" : "Not active"}
          </Typography>
        </Stack>

        <Stack spacing={3} sx={{ ml: { md: 5, lg: 20 } }}>
          <Stack direction="column">
            <Typography variant="body2" color="text.secondary">Academics </Typography>
            <Rating precision={0.5} name="read-only" value={4.5} readOnly size="large" icon={<School />} emptyIcon={<SchoolOutlined />} />
          </Stack>

          <Stack direction="column">
            <Typography variant="body2" color="text.secondary">Discipline </Typography>
            <Rating precision={0.5} name="read-only" value={1} readOnly size="large" icon={<EmojiEvents />} emptyIcon={<EmojiEventsOutlined />} />
          </Stack>
        </Stack>
        <Box sx={{ display: 'flex' }}>
          <Link to={`/students/profile/${student.id}/edit`}>Edit</Link>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ width: '100%' }}>
        <Tabs
          sx={{ borderBottom: '1px solid #e8e8e8', }}
          value={tabIndex}
          onChange={selectTab}
          textColor="secondary"
          indicatorColor="secondary">
          <Tab icon={<Info sx={{ fontSize: 20 }} />} iconPosition="start" label="About"  {...panelProps(0)} />
          <Tab icon={<Group sx={{ fontSize: 20 }} />} iconPosition="start" label="Parents"  {...panelProps(1)} />
          <Tab icon={<School sx={{ fontSize: 20 }} />} iconPosition="start" label="Courses"  {...panelProps(2)} />
          <Tab icon={<Assessment sx={{ fontSize: 20 }} />} iconPosition="start" label="Exams"  {...panelProps(3)} />
          <Tab icon={<Receipt sx={{ fontSize: 20 }} />} iconPosition="start" label="Invoices"  {...panelProps(4)} />
          <Tab icon={<EmojiEvents sx={{ fontSize: 20 }} />} iconPosition="start" label="Awards"  {...panelProps(5)} />
          <Tab icon={<Gavel sx={{ fontSize: 20 }} />} iconPosition="start" label="Discipline"  {...panelProps(6)} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <div>
            <span>Home address</span>
            <pre>{student.homeAddress}</pre>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>Parents</TabPanel>
        <TabPanel value={tabIndex} index={2} children={tabIndex}>Courses</TabPanel>
        <TabPanel value={tabIndex} index={3} children={tabIndex}>Exams</TabPanel>
      </Box>
    </Card>
  );
};

export default StudentDetails;
