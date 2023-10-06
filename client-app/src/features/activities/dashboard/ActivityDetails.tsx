import { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import LoaderComponent from '../../../app/layout/LoaderComponent';
import ActivityDetailHeader from '../details/ActivityDetailHeader';
import ActivityDetailInfo from '../details/ActivityDetailInfo';
import ActivityDetailChat from '../details/ActivityDetailChat';
import ActivityDetailSidebar from '../details/ActivityDetailSidebar';

export default observer(function ActivityDetails() {
    const {activityStore} = useStore();
    const {id} = useParams();

    useEffect(()=>{
        if(id) activityStore.loadActivity(id);
    },[id, activityStore, activityStore.loadActivity])

    return (
        <>
            {
                activityStore.loading || !activityStore.selectedActivity ? <LoaderComponent /> :
                <Grid>
                    <Grid.Column width={10}>
                        <ActivityDetailHeader activity={activityStore.selectedActivity}/>
                        <ActivityDetailInfo  activity={activityStore.selectedActivity}/>
                        <ActivityDetailChat />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ActivityDetailSidebar />
                    </Grid.Column>
                </Grid>
            }
        </>
    )
})