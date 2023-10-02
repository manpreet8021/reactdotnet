import React, { useEffect } from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import LoaderComponent from '../../../app/layout/LoaderComponent';

export default observer(function ActivityDetails() {
    const {activityStore} = useStore();
    const {id} = useParams();

    useEffect(()=>{
        if(id) activityStore.loadActivity(id);
    },[id, activityStore])

    return (
        <>
            {
                activityStore.loading ? <LoaderComponent /> :
                <Card fluid>
                    <Image src={`/assets/categoryImages/${activityStore.selectedActivity?.category}.jpg`}/>
                    <Card.Content>
                        <Card.Header>{activityStore.selectedActivity?.title}</Card.Header>
                        <Card.Meta>
                            <span className='date'>{activityStore.selectedActivity?.date}</span>
                        </Card.Meta>
                        <Card.Description>
                            {activityStore.selectedActivity?.description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Button.Group widths='2'>
                            <Button basic color='blue' content='Edit' as={Link} to={`/updateActivity/${activityStore.selectedActivity?.id}`} />
                            <Button basic color='grey' content='Cancel' as={Link} to={'/activities'}/>
                        </Button.Group>
                    </Card.Content>
                </Card>
            }
        </>
    )
})