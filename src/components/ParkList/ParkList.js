import { Box } from "@mui/material";
import React, { useState, useEffect  } from 'react';
import Button from "@material-ui/core/Button"
import SendIcon from '@mui/icons-material/Send'
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';


import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import api from '../../services/api';
import './ParkList.css';




const ParkList = () => {
  // ı want to get park list object witj a sample endpoint with using this func apiRequest(url, 'GET', null, headers)
 
  const [parkList, setParkList] = useState([]);
  const [parkListLoading, setParkListLoading] = useState(true);
  const [parkListError, setParkListError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("https://o11xc731wl.execute-api.eu-central-1.amazonaws.com/dev2/listparks", {
          headers: { 'Content-Type': 'application/json' }
        });
       
        const transformedData = response.map(park => ({
          id: park.parkID,
          parkName: park.parkName,
          lat: park.lat,
          lng: park.lng,
          capacity: park.capacity,
          emptyCapacity: park.emptyCapacity,
          isActive: park.state === "1" ? "Active" : "Inactive"
        }));
        debugger;
        setLoading(false);
        setParkList(transformedData);
       
      } catch (error) {
        
        setParkListError(error.message);
       
      } finally {
       
        setParkListLoading(false);
       
      }
    }
    fetchData();
  }, [refreshKey]);

  const columns = [
    { 
      field: "id", 
      headerName: "Park ID" , 
      type: "Number" 
    },
    {
      field: "parkName",
      headerName: "Park Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lat",
      headerName: "Latitude",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "lng",
      headerName: "Longitude",
      flex: 1,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      flex: 1,
    },
    {
      field: "emptyCapacity",
      headerName: "Empty Capacity",
      flex: 1,
      
    },
    {
        field: "isActive",
        headerName: "Activeness",
        flex: 1,
        editable : true ,
        type : "singleSelect",
        width : 200,
        valueOptions : ({id, row, field}) => {
          return ['Active' , 'Inactive']
      }
        
      },
    
      {
        field: "actions",
        type : "actions",
        headerName: "Edit",
        width : 100,
        cellClassName: "actions",
        getActions : ({id, isActive}) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if(isInEditMode){
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id, isActive)}
              />
             
            ];
          }
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
         
          ];

          }
        }
        
       
        
      
  ];

  const [rows, setRows] = React.useState(columns);
  const [rowModesModel, setRowModesModel] = React.useState({});

 //////////////////////////////////////

   /////////////////////////////
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
    console.log("Selected Rows:", newSelectionModel); // Debugging line
    debugger;
  };

  const handleSubmit = async () => {
    console.log("Selected Rows on Submit:", selectedRows); // Debugging line
    debugger;
    const payload = {
      parks: selectedRows.map((id) => {
        const row = parkList.find((row) => row.id === id);
        let state = []
        if (row.isActive === "Active"){
            state = "1"
        }
        else if (row.isActive === "Inactive"){
            state = "0"
        }
        debugger;
        return {
          parkId: row.id.toString(),
          state: state
        };
      }),
    };
    console.log("Payload:", payload); // Debugging line
    debugger;
    try {
      await api.post("https://o11xc731wl.execute-api.eu-central-1.amazonaws.com/dev2/configurestateparks", payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      debugger;
      setRefreshKey(oldKey => oldKey + 1);
      window.location.reload();
    } catch (error) {
      // Handle error
      console.error("Error submitting parks: ", error);
    }
  };

  

  const handleEditClick = (id) => () => {
    
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

 
  const processRowUpdate = (newRow) => {
    setParkList((prev) =>
      prev.map((row) => (row.id === newRow.id ? { ...row, ...newRow } : row))
    );
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };



  
  return (
    <Box className={`app-container ${loading ? 'gifBox' : ''}`}>
      {loading ? (
        // Show the loading spinner while waiting for a response
        <img src="/logogif.gif" alt="Loading" className="gif"/>
      ) : (
        // Render your content when the loading is complete
        <Box key={refreshKey} m="20px">
        
        <Box
          m="40px 0 0 0"
          height="70vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
            
            },
            "& .MuiDataGrid-columnHeaders": {
      
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
          
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
      
            },
            "& .MuiCheckbox-root": {
              color: "green"
            },
            "& .MuiCheckbox-root.Mui-checked": {
              color: "green"
            },
          
          }}
        >
          <DataGrid checkboxSelection 
          rows={parkList} 
          columns={columns}
          editMode="row"
          initialState={{
            pagination: {
              paginationModel : {
                pageSize : 10
              }
            } 
          }}
          pageSizeOptions={10}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowSelectionModelChange={handleSelectionModelChange}

          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
        
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }} 
          />

    
        </Box>
      

        
        <Button variant = "contained" color ="secondary"  endIcon= {<SendIcon />} onClick={handleSubmit}>
          SUBMIT
        </Button>
      </Box>
      )}

      
    </Box>
  );
};

export default ParkList;