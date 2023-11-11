import { observer } from 'mobx-react-lite';
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import {Activity} from "../../../app/models/activity";
import { Link } from 'react-router-dom';
import {format} from 'date-fns';
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer (function ActivityDetailHeader({activity}: Props) {
    const {activityStore: {updateAttendance, buttonLoader, cancelActivityToggle}} = useStore()
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {activity.isCancelled && <Label style={{position:'absolute', zIndex: 10, left: -14, top:20}} ribbon color='red' content='Cancelled'  />}
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy h:mm aa')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${activity.host?.userName}`}>{activity.host?.displayName}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <>
                        <Button onClick={cancelActivityToggle} floated='left' basic color={activity.isCancelled ? 'green' : 'red'}
                            loading={buttonLoader} content={activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity'} />
                        <Button color='orange' floated='right' as={Link} to={`/updateActivity/${activity.id}`} disabled={activity.isCancelled}>
                            Manage Event
                        </Button>
                    </>
                ) : activity.isGoing ? (
                    <Button onClick={updateAttendance} loading={buttonLoader}>Cancel attendance</Button>
                ) : (
                    <Button onClick={updateAttendance} loading={buttonLoader} color='teal'  disabled={activity.isCancelled}>Join Activity</Button>
                )}
                
                
            </Segment>
        </Segment.Group>
    )
})