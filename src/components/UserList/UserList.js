import { Box, Typography, useTheme } from "@mui/material";
import React, { useState, useEffect  } from 'react';
import Button from "@material-ui/core/Button"
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SendIcon from '@mui/icons-material/Send'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../ErrorModal/ErrorModal'; 


import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import api from '../../services/api';




const UserList = () => {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(true); // Yetki durumunu kontrol eden state
  const [errorMessage, setErrorMessage] = useState(''); 
  const [userList, setUserList] = useState([]);
  const [userListLoading, setUserListLoading] = useState(true);
  const [userListError, setUserListError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
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
        const response = await api.get("https://o11xc731wl.execute-api.eu-central-1.amazonaws.com/dev2/getuserlist", {
          headers: { 'Content-Type': 'application/json' }
        });
        
        const transformedData = response.map((user , index) => ({
          id : index + 1,
          userName : user.Username,
          Name: user.Name,
          Surname: user.Surname,
          mail: user.Mail,
          Role: user.Roles,
          

        }));
      
        setLoading(false);
        setUserList(transformedData);
      
      } catch (error) {
       
        setUserListError(error.message);
     
      } finally {
  
        setUserListLoading(false);
 
      }
    }
    fetchData();
  }, [refreshKey]);

 
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "userName",
      headerName: "Username",

      cellClassName: "name-column--cell",
    },
    {
      field: "Name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Surname",
      headerName: "Surname",
      flex: 1,
    },
  
    {
      field: "mail",
      headerName: "Mail",
      flex: 1,
    },
    {
      field: "Role",
      headerName: "Access Level",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Admin", "ParkingSystemAdmin", "StandardUser"],
      renderCell: ({ row }) => {
      
        let displayText = "";
        let Icon = null;
        
        let role;

        if (Array.isArray(row.Role)) {
          // row.Role bir dizi ise, en dominant role'ü bul
          const rolePriority = ["Admin", "ParkingSystemAdmin", "StandardUser"];
          role = rolePriority.find(priorityRole => 
            row.Role.some(userRole => userRole === priorityRole)
          );
        } else {
          // row.Role bir string ise, doğrudan kullan
          role = row.Role;
        }

        if (role === "Admin") {
          displayText = "Admin";
          Icon = AdminPanelSettingsOutlinedIcon;
        } else if (role === "ParkingSystemAdmin") {
          displayText = "Parking System Admin";
          Icon = SecurityOutlinedIcon;
        } else if (role === "StandardUser") {
          displayText = "Standard User";
          Icon = LockOpenOutlinedIcon;
        }
        
    
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            borderRadius="4px"
          >
            {Icon && <Icon />}
            <Typography sx={{ ml: "5px" }}>
              {displayText}
            </Typography>
          </Box>
        );
      },
    } ,
     
    
    {
      field: "actions",
      type : "actions",
      headerName: "Edit",
      width : 100,
      cellClassName: "actions",
      getActions : ({id}) => {
        const isInEditMode = rowModesModel[id]?.mode == GridRowModes.Edit;

        if(isInEditMode){
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
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

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
   
  };

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
    console.log("Selected Rows:", newSelectionModel); // Debugging line
 
  };

  const handleSubmit = async () => {
    console.log("Selected Rows on Submit:", selectedRows); // Debugging line
   
    const payload = {
      editedUsers: selectedRows.map((id) => {
        const row = userList.find((row) => row.id === id);
        

        let roles = [];
        if (row.Role ==="Admin") {
          roles = ["Admin", "ParkingSystemAdmin", "StandardUser"];
        } else if (row.Role === "ParkingSystemAdmin") {
          roles = ["ParkingSystemAdmin", "StandardUser"];
        } else if (row.Role === "StandardUser") {
          roles = ["StandardUser"];
        }
        return {
          Username: row.userName,
          Name: row.Name,
          Surname: row.Surname,
          Mail: row.mail,
          Roles : roles
          
        };
      }),
    };
    console.log("Payload:", payload); // Debugging line
    
    try {
      await api.post("https://o11xc731wl.execute-api.eu-central-1.amazonaws.com/dev2/edituserlist", payload, {
        headers: { 'Content-Type': 'application/json' }
        
      });
      setRefreshKey(oldKey => oldKey + 1);
      console.log("post")
      window.location.reload();
    } catch (error) {
      // Handle error
      console.error("Error submitting users: ", error);
    }
  };



  const processRowUpdate = (newRow) => {
    setUserList((prev) =>
      prev.map((row) => (row.id === newRow.id ? { ...row, ...newRow } : row))
      
    );
    
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  
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
              color : "green"
            },
            "& .MuiCheckbox-root.Mui-checked": {
              color: "green"
            },

            
          }}
        >
          <DataGrid checkboxSelection 
          rows={userList} 
          columns={columns} 
          editMode="row"
          initialState={{
            pagination: {
              paginationModel : {
                pageSize : 10
              }
            } 
          }}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onRowSelectionModelChange={handleSelectionModelChange}

        
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          />
        </Box>
        <Button variant = "contained" color = "secondary" endIcon= {<SendIcon />} onClick={handleSubmit}>
          SUBMIT
        </Button>
      </Box>
    )}

      
    </Box>
   
  );
};

export default UserList;