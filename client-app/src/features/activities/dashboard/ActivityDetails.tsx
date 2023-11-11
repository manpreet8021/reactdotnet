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
    const {activityStore: {loadActivity, clearSelectedActivity, selectedActivity, loading}} = useStore();
    const {id} = useParams();

    useEffect(()=>{
        if(id) loadActivity(id);
        return () => clearSelectedActivity();
    },[id, loadActivity, clearSelectedActivity])

    return (
        <>
            {
                loading || !selectedActivity ? <LoaderComponent /> :
                <Grid>
                    <Grid.Column width={10}>
                        <ActivityDetailHeader activity={selectedActivity}/>
                        <ActivityDetailInfo  activity={selectedActivity}/>
                        <ActivityDetailChat activityId={selectedActivity.id}/>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ActivityDetailSidebar activity={selectedActivity!}/>
                    </Grid.Column>
                </Grid>
            }
        </>
    )
})