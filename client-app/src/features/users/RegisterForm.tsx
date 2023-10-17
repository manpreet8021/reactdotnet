import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MytextInput";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import * as Yup from 'yup';
import ValidationError from "../error/ValidationError";

export default observer(function RegisterForm() {
    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{displayName: '', username: '', email: '', password: '', error: null}}
            onSubmit={(values, {setErrors})=>userStore.register(values).catch(error=>setErrors({error}))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required()
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty })=> (
                <Form className="ui form error" autoComplete="off" onSubmit={handleSubmit}>
                    <Header as='h2' content='Register to Reactivities' color="teal" textAlign="center" />

                    <ErrorMessage name="error" render={()=><ValidationError errors={errors.error as unknown as string[]} />} />

                    <MyTextInput placeholder="Display Name" name="displayName"/>
                    <MyTextInput placeholder="Username" name="username"/>
                    <MyTextInput placeholder="Email" name="email"/>
                    <MyTextInput placeholder="Password" type="password" name="password"/>
                    <Button 
                        disabled={!isValid || !dirty || isSubmitting}
                        positive content='Register' loading={isSubmitting} type="submit" fluid />
                </Form>
            )}
        </Formik>
    )
})