import { Container, Nav, Navbar, Stack } from "react-bootstrap"; 
import { Link } from "react-router-dom";
import { useContext } from "react";
import {AuthContext} from "../context/AuthContext" ;
import Notification from "../components/chat/Notification";

const NavBar = () => {
  const {user , logoutUser} = useContext(AuthContext) ;
  return (
    <Navbar bg="dark" className="mh-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            KatkoutChatt🐥
          </Link>
        </h2>
        { user &&  (
 <span className="text-warning">Katkout(a) {user?.name}</span>
        )}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {
              user && (<>
              <Notification/>
            
               <Link onClick={()=> logoutUser()} to="/login" className="link-light text-decoration-none">
              logout
            </Link>
               </>)
            }
            {!user && (<>   
              <Link to="/login" className="link-light text-decoration-none">
              Login
            </Link>
            <Link to="/registrer" className="link-light text-decoration-none">
            registrer
            </Link>
            </>)}
          
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
