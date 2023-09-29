import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEditActivity: (activity: Activity) => void; 
}

export default function ActivityForm({activity: selectedActivity, closeForm, createOrEditActivity}:Props) {

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        description:'',
        category:'',
        date:'',
        city:'',
        venue:''
    }

    const [activity, setActivity] = useState(initialState);

    function handleOnChange(event:ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setActivity({...activity, [name]: value})
    }

    function handleSubmit() {
        createOrEditActivity(activity);
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autocomplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name="title" onChange={handleOnChange}/>
                <Form.Input placeholder='Description' value={activity.description} name="description" onChange={handleOnChange}/>
                <Form.Input placeholder='category' value={activity.category} name="category" onChange={handleOnChange}/>
                <Form.Input placeholder='Date' value={activity.date} name="date" onChange={handleOnChange}/>
                <Form.Input placeholder='City' value={activity.city} name="city" onChange={handleOnChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name="venue" onChange={handleOnChange}/>
                <Button floated="right" positive type="submit" content='Submit' />
                <Button floated="right" type="button" content='Cancel' onClick={closeForm}/>
            </Form>
        </Segment>
    )
}