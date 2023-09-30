import { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoaderComponent from './LoaderComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list()
    .then(res => {
      let activity: Activity[] = [];
      res.forEach((element: Activity) => {
        element.date = element.date.split('T')[0];
        activity.push(element);
      });
      setActivities(activity)
    })
    .catch(err => console.error(err))
    .finally(()=>{
      setLoading(false);
    });
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

  function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true);
    if(activity.id) {
      agent.Activities.update(activity).then(()=>{
        setActivities([...activities.filter(x => x.id !== activity.id),activity])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false)
      })
    } else {
      activity.id=uuid();
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities, activity])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false)
      })
    }
  }

  function handleDelete(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false);
    })
  }

  return (
    <>
      {
        loading ? <LoaderComponent content='Loading app'/>
        : 
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
              closeForm={handleFormClose}
              createOrEditActivity={handleCreateOrEditActivity}
              handleDelete={handleDelete}
              submitting={submitting} />
          </Container>
        </>
      }
    </>
  );
}

export default App;
