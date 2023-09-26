import { useEffect, useState } from 'react';
import axios from 'axios';
import {Header, List, ListItem} from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/activities").then(res => setActivities(res.data)).catch(err => console.error(err));
  }, [])

  return (
    <div className="App">
      <Header as='h1'>
        Reactivities
      </Header>
      <List>
        {activities.map((activities: any) => (
          <ListItem key={activities.id}>
            {activities.title}
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default App;
