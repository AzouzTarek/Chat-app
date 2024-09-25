import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap"
import { useContext } from "react";
import {AuthContext} from "../context/AuthContext"

const Registre = () => {
    const {registrerInfo , updateRegistrerInfo , registerUser , registerError , isRegisterLoading} = useContext(AuthContext) ;
    return (

        <>

            <Form onSubmit={registerUser}>
                <Row
                    style={{
                        height: "100vh",
                        justifyContent: "center",
                        paddingTop: "10%",
                    }}>
                    <Col xs={6}>
                        <Stack gap={3} >
                            <h2>Register</h2>
                          
                            <Form.Control type="text" placeholder="Name" onChange={(e)=>updateRegistrerInfo ({...registrerInfo , name:e.target.value})} />
                          
                          <Form.Control type="email" placeholder="Email" onChange={(e)=>updateRegistrerInfo ({...registrerInfo , email:e.target.value})} />
                          <Form.Control type="password" placeholder="Password" onChange={(e)=>updateRegistrerInfo ({...registrerInfo , password:e.target.value})} />
                        <Button variant="primary" type="submit"> Regiser
                            {isRegisterLoading ? "creatng your count"  : "Register"}
                            </Button> 
                            {
                                registerError?.error && 
                                <Alert variant="danger"> 
                                <p> {registerError?.message}</p>
                            </Alert>
                            }  
                          

                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    )
};
export default Registre;