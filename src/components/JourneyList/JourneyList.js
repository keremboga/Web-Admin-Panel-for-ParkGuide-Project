import { Box } from "@mui/material";
import React, { useState, useEffect  } from 'react';

import { useNavigate } from 'react-router-dom';
import ErrorModal from '../ErrorModal/ErrorModal'; 


import { DataGrid } from '@mui/x-data-grid';
import api from '../../services/api';




const JourneyList = () => {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(true); // Yetki durumunu kontrol eden state
  const [errorMessage, setErrorMessage] = useState(''); 
  const [journeyList, setJourneyList] = useState([]);
  const [journeyListLoading, setJourneyListLoading] = useState(true);
  const [journeyListError, setJourneyListError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const mostpowerful = localStorage.getItem('mostpowerful');
    if (mostpowerful !== 'Admin') {
      setHasPermission(false);
      setErrorMessage('You have no permission to access this page.');
      return;
    }

    async function fetchData() {
      try {
        const response = await api.get("https://o11xc731wl.execute-api.eu-central-1.amazonaws.com/dev2/getjourneys", {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const transformedData = response.map((journey , index) => ({
          id :                  journey.JourneyId,
          userName:             journey.User,
          destinationDistrict : journey.DestinationDistrict,
          startingLocation:     journey['StartingLocation(lat-lng)'],
          startingDistrict:     journey.StartingDistrict,
          dayOfWeek:            journey.DayOfWeek,
          destinationLocation:     journey['DestinationLocation(lat-lng)'],
          isFinished:           journey.IsFinished === "1" ? "Finished" : "Not Finished",
          startTime:            journey.StartTime,
        }));
      
        setLoading(false);
        setJourneyList(transformedData);
      
      } catch (error) {
       
        setJourneyListError(error.message);
     
      } finally {
  
        setJourneyListLoading(false);
 
      }
    }
    fetchData();
  }, [refreshKey]);

 
  const columns = [
    { field: "id", headerName: "JourneyID" },
    {
      field: "userName",
      headerName: "User",

      cellClassName: "name-column--cell",
    },
    
    {
        field: "dayOfWeek",
        headerName: "Day Of Week",
        flex: 0.6,
    },

    {
        field: "startTime",
        headerName: "Start Time",
        flex: 1,
    },

    {
        field: "startingLocation",
        headerName: "Starting Location",
        headerAlign: "left",
        flex: 1,
    },

    {
        field: "startingDistrict",
        headerName: "Starting District",
        flex: 0.8,
    },

    {
        field: "destinationLocation",
        headerName: "Destination Location",
        flex: 1,
    },

    {
      field: "destinationDistrict",
      headerName: "Destination District",
      flex: 1,
    },
    

    {
        field: "isFinished",
        headerName: "Status",
        flex: 0.5,
    },
  ];

  const [rows, setRows] = React.useState(columns);

  if (!hasPermission) {
    return  navigate('/parks');
  }

  return (
    <Box className={`app-container ${loading ? 'gifBox' : ''}`}>
      {loading ? (
        // Show the loading spinner while waiting for a response
        <img src="/logogif.gif" alt="Loading" className="gif"/>
      ) : (
        // Render your content when the loading is complete
      <Box m="20px">
        
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },

            "& .MuiDataGrid-columnHeaders": {
      
              borderBottom: "none",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
      
            },

          }}
        >
          <DataGrid
          rows={journeyList} 
          columns={columns}
          initialState={{
            pagination: {
              paginationModel : {
                pageSize : 10
              }
            } 
          }}

          />
        </Box>
      </Box>
    )}

      
    </Box>
   
  );
};

export default JourneyList;