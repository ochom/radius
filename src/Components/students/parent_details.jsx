import { Alert, Avatar, Box, Button, Card, Divider, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Service } from '../../API/service';
import { CustomLoader } from "../customs/monitors"
import { AssignmentInd, PeopleOutlined, Phone, Search, Wc, Work } from "@mui/icons-material";
import { panelProps, TabPanel } from "../customs/tabs";
import { useHistory } from "react-router-dom";
import { DataTable } from "../customs/table";
import { LoadingButton } from "@mui/lab";



const cols = [
  {
    name: "#REG", selector: (row) => row.reg,
  },
  {
    name: "Name", selector: (row) => row.fullName,
  },
  {
    name: "Relationship", selector: (row) => row.relationship,
  },
  {
    name: "Class", selector: (row) => row.classroom,
  },
]



const ParentDetails = (props) => {
  const history = useHistory()
  const [parent, setParent] = useState(null);
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [idNumber, setIDNumber] = useState("")
  const [tabIndex, setTabIndex] = useState(0)

  const selectTab = (event, newValue) => {
    setTabIndex(newValue);
  };


  const searchParent = (e) => {
    e.preventDefault()
    setSearching(true)
    let query = {
      query: `query ($data: ID!){
        parent: getParentByIDNumber(id: $data) {
          id
          fullName
          gender
          idNumber
          mobile
          email
          occupation
          children{
            id
            fullName
            relationship
            admissionNumber
            classroom
          }
        }
      }`,
      variables: {
        data: idNumber
      }
    }
    new Service().getData(query).then((res) => {
      setParent(res?.parent || null)
      setSearching(false)
      setSearched(true)
      setTimeout(() => {
        setSearched(false)
      }, 5000)
    });
  }

  const onSearchNew = () => {
    setIDNumber("")
    setParent(null)
    setSearching(false)
    setSearched(false)
  }


  const openProfile = row => {
    history.push(`/students/profile/${row.id}`)
  }

  return (
    <>
      {searching && <Paper sx={{ px: 5, py: 2 }}> <CustomLoader /></Paper>}

      {((!searching && !searched && !parent) || (searched && !parent)) &&
        <Paper sx={{ px: 5, py: 2 }}>
          <Box sx={{ display: 'flex', py: 5, justifyContent: "center" }}>
            <form onSubmit={searchParent} method="post">
              <Stack direction="column" spacing={3}>
                <div>
                  <TextField type="text" label="Search By ID Number"
                    required
                    value={idNumber}
                    placeholder="Enter ID Number"
                    fullWidth
                    onChange={e => setIDNumber(e.target.value)} />
                </div>
                {(searched && !parent) &&
                  <Alert severity="warning">Parent not found</Alert>
                }
                <LoadingButton
                  type='submit'
                  variant='contained'
                  color='secondary'
                  size='large'
                  loading={searching}
                  loadingPosition="start"
                  startIcon={<Search />}>Search</LoadingButton>
              </Stack>
            </form>
          </Box>
        </Paper>
      }

      {parent &&
        <>
          <div className="mb-3">
            <Button color="secondary" onClick={onSearchNew}>
              <Typography><i className="fa fa-search"></i>  Find another parent</Typography>
            </Button>
          </div>

          <Card>
            <Box sx={{ p: 3, display: 'flex' }} >
              <Stack>
                <Avatar variant="rounded" sx={{ width: "10rem", height: "10rem" }} />
              </Stack>
              <Box sx={{ display: 'flex' }}>
                <Stack spacing={1.5} sx={{ ml: 5, alignItems: "start" }}>
                  <Typography fontWeight={700}>{parent.fullName}
                    <Typography fontWeight={300} sx={{ fontSize: ".8rem" }} color="text.secondary">{parent.email}</Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Wc sx={{ fontSize: "1.2rem" }} color="secondary" />  {parent.gender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Phone sx={{ fontSize: "1.2rem" }} color="secondary" />  {parent.mobile}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <AssignmentInd sx={{ fontSize: "1.2rem" }} color="secondary" />  {parent.idNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Work sx={{ fontSize: "1.2rem" }} color="secondary" />  {parent.occupation}
                  </Typography>
                </Stack>
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
                <Tab icon={<PeopleOutlined sx={{ fontSize: 20 }} />} iconPosition="start" label="Children"  {...panelProps(0)} />
              </Tabs>
              <TabPanel value={tabIndex} index={0}>
                <DataTable
                  progressPending={searching}
                  columns={cols}
                  onRowClicked={openProfile}
                  data={
                    (parent?.children || []).map(child => {
                      return {
                        id: child.id,
                        reg: child.admissionNumber,
                        fullName: child.fullName,
                        relationship: child.relationship,
                        classroom: child.classroom
                      };
                    })} />

              </TabPanel>
            </Box>
          </Card>
        </>
      }
    </>
  );
};

export default ParentDetails;
