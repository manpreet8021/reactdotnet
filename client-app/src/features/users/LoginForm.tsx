import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MytextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { error } from "console";

export default observer(function LoginForm() {
    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{email: '', password: '', error: null}}
            onSubmit={(values, {setErrors})=>userStore.login(values).catch(error=>setErrors({error: 'Invalid email or password'}))}
        >
            {({handleSubmit, isSubmitting, errors})=> (
                <Form className="ui form" autoComplete="off" onSubmit={handleSubmit}>
                    <Header as='h2' content='Login to Reactivities' color="teal" textAlign="center" />
                    <ErrorMessage name="error" render={()=><Label style={{marginBottom: 10}} basic color='red' content={errors.error}/>} />
                    <MyTextInput placeholder="Email" name="email"/>
                    <MyTextInput placeholder="Password" type="password" name="password"/>
                    <Button positive content='Login' loading={isSubmitting} type="submit" fluid />
                </Form>
            )}
        </Formik>
    )
})