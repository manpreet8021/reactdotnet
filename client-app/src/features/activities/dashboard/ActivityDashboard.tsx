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
    createOrEditActivity: (activity: Activity) => void;
    handleDelete: (id:string) => void;
}

export default function ActivityDashboard({activities, selectActivity, cancelActivity, selectedActivity, openForm, closeForm, editMode, createOrEditActivity, handleDelete}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <List>
                    <ActivityList 
                        activities={activities} 
                        selectActivity={selectActivity}
                        handleDelete={handleDelete} />
                </List>
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&
                    <ActivityDetails 
                        activity={selectedActivity} 
                        cancelActivity={cancelActivity}
                        openForm={openForm} />}
                {editMode && 
                    <ActivityForm activity={selectedActivity} closeForm={closeForm} createOrEditActivity={createOrEditActivity}/>
                }
            </Grid.Column>
        </Grid>
    )
}