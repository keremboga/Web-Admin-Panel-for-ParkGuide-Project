import { Box } from "@mui/material";
import React, { useState, useEffect  } from 'react';

import { useNavigate } from 'react-router-dom';
import ErrorModal from '../ErrorModal/ErrorModal'; 


import { DataGrid } from '@mui/x-data-grid';
import api from '../../services/api';




const ReportList = () => {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(true); // Yetki durumunu kontrol eden state
  const [errorMessage, setErrorMessage] = useState(''); 
  const [reportList, setReportList] = useState([]);
  const [reportListLoading, setReportListLoading] = useState(true);
  const [reportListError, setReportListError] = useState(null);
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
        const response = await api.get("https://o11xc731wl.execute-api.eu-central-1.amazonaws.com/dev2/getreports", {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const transformedData = response.map((report , index) => ({
          id :      report.ReportId,
          userName: report.UserName,
          content : report.Content,
          topic:    report.ReportTopic,
          date:     report.Date,
        }));
      
        setLoading(false);
        setReportList(transformedData);
      
      } catch (error) {
       
        setReportListError(error.message);
     
      } finally {
  
        setReportListLoading(false);
 
      }
    }
    fetchData();
  }, [refreshKey]);

 
  const columns = [
    { field: "id", headerName: "ReportID" },
    {
      field: "userName",
      headerName: "Username",

      cellClassName: "name-column--cell",
    },
    {
      field: "date",
      headerName: "Date of Report",
      flex: 0.3,
    },
    {
      field: "topic",
      headerName: "Topic",
      headerAlign: "left",
      flex: 0.3,
    },
    
    {
        field: "content",
        headerName: "Content",
        flex: 1,
    },
    
  ];

  const [rows, setRows] = React.useState(columns);

  if (!hasPermission) {
    return <ErrorModal message={errorMessage} onClose={() => navigate('/parks')} />;
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
          rows={reportList} 
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

export default ReportList;