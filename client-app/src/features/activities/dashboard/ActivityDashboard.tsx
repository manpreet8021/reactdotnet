import { Grid, List } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoaderComponent from "../../../app/layout/LoaderComponent";

export default observer(function ActivityDashboard() {
    const {activityStore} = useStore();

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore])

    return (
        <>
            {
                activityStore.loading ? <LoaderComponent content='Loading app'/> : 
                <Grid>
                    <Grid.Column width='10'>
                        <List>
                            <ActivityList />
                        </List>
                    </Grid.Column>
                </Grid>
            }
        </>
    )
})