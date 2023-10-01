import { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoaderComponent from './LoaderComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  useEffect(() => {
    activityStore.loadActivity();
  }, [activityStore])

  return (
    <>
      {
        activityStore.loading ? <LoaderComponent content='Loading app'/>
        : 
        <>
          <Navbar />
          <Container style={{ marginTop: '7em' }}>
            <ActivityDashboard />
          </Container>
        </>
      }
    </>
  );
}

export default observer(App);
