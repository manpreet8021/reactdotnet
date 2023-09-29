import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/activities").then(res => setActivities(res.data)).catch(err => console.error(err));
  }, [])

  function handleSelectedActivity(id: string)  {
    handleFormClose();
    setSelectedActivity(activities.find(x => x.id===id));
  }

  function handleCancelActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectedActivity(id) : handleCancelActivity()
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  return (
    <>
      <Navbar openForm={handleFormOpen}/>
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity={selectedActivity} 
          selectActivity={handleSelectedActivity} 
          cancelActivity={handleCancelActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose} />
      </Container>
    </>
  );
}

export default App;
