import { useState } from "react";
import Registration from "./components/Registration";
import { Route, Routes} from "react-router-dom";
import Feed from "./components/Feed";
import Unauthorized from "./components/Unauthorized";
// import RequiredAuth from "./components/RequiredAuth";

function App() {

  const [users, setUsers] = useState([]);


  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element = {
          <Registration
            users = {users}
            setUsers = {setUsers}
          />}
        />
        <Route path="/feed/:id" element = {
            <Feed
              users = {users}
              setUsers = {setUsers}
            />
          }
        />
        <Route path = {'/unauthorized'} element = {<Unauthorized/>}
        />
      </Routes>
    </div>
  );
}

export default App;
