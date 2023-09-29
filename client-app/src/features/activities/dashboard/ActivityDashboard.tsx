import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "./ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id:string) => void;
    cancelActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
}

export default function ActivityDashboard({activities, selectActivity, cancelActivity, selectedActivity, openForm, closeForm, editMode}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <List>
                    <ActivityList 
                        activities={activities} 
                        selectActivity={selectActivity} />
                </List>
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&
                    <ActivityDetails 
                        activity={selectedActivity} 
                        cancelActivity={cancelActivity}
                        openForm={openForm} />}
                {editMode && 
                    <ActivityForm activity={selectedActivity} closeForm={closeForm} />
                }
            </Grid.Column>
        </Grid>
    )
}