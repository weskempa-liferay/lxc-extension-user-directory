import './App.css';
import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import LiferayApi from './common/services/liferayApi';

export default function App() {

  const [users, setUsers] = useState([]);
  const [searchString, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(()=>{
    LiferayApi("/o/headless-admin-user/v1.0/user-accounts")
    .then((response) => {

      console.log(response.data.items)
      setUsers(response.data.items);

    })
    .catch(console.log)
  
  },[])

  function search(items) {
    return items.filter((item) => {
      return item.name.indexOf(searchString)>-1;
    });
  }

  function handleSelectUser(user){
    //console.log(user);
    setSelectedUser(user);
  }

  function getExpando(user,fieldName){
    //console.log(user);
    setSelectedUser(user);

    for(let key in user.customFields){
      if(user.customFields[key].name==fieldName){
        return user.customFields[key].customValue.data;
      }
    }

    return "";
  }

  function formatDate(dateStr){
    if(dateStr.length>=10){
      return dateStr.substring(0,10);
    }
    return "";
  }

  function SelectedUserDisplay(props) {
    const selectedUser = props.selectedUser;
    if (selectedUser.id) {
      return  <Card sx={{ padding: 1, marginBottom: 2 }} key={selectedUser.id} 
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <CardMedia
                        sx={{ height: 240}}
                        image={"http://localhost:8080"+selectedUser.image}
                      />

                    </Grid>
                    <Grid item xs={8} >

                      <h2>{selectedUser.name}</h2>
                      <h4><i>{selectedUser.jobTitle}</i></h4>
                      <p><b>Department: </b> {getExpando(selectedUser,"Department")}</p>

                      <p><b>Birth Date: </b> 
                      {formatDate(selectedUser.birthDate)}</p>

                      <p><b>Join Date: </b> 
                      {formatDate(getExpando(selectedUser,"Join Date"))}</p>

                      <p><b>Hobbies: </b><br/> 
                      {getExpando(selectedUser,"Hobbies")}</p>

                      <p><b>Educational Background: </b><br/> 
                      {getExpando(selectedUser,"Educational Background")}</p>

                    </Grid>
                  </Grid>

                </Card>;
    }
    return <div>No user selected</div>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
              
          <TextField id="outlined-basic" label="Search" variant="outlined" 
            value={searchString}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="user-directory">
            
            {search(users).map((user, index) => (

              <Card sx={{ padding: 1, marginBottom: 2 }} key={user.id} 
                onClick={() => handleSelectUser(user)}
              >

                <CardMedia
                  sx={{ height: 140}}
                  image={"http://localhost:8080"+user.image}
                />
                
                <h3>{user.name}</h3>
                <h5>{user.jobTitle}</h5>
              </Card>

            ))}

          </div>

      </Grid>
      <Grid item xs={5} className="selectedUserDisplay">

        <SelectedUserDisplay selectedUser={selectedUser}></SelectedUserDisplay>
          
      </Grid>
    </Grid>
  );
}
