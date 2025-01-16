import AdminNavbar from "../../admin/Navbar/AdminNavbar";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../admin/Sidebar/AdminSidebar";
import "react-calendar/dist/Calendar.css";
import { useMain } from "../../../hooks/useMain";
import HrSidebar from "../../Hr/Sidebar/HrSidebar";
import HrNavbar from "../../Hr/Navbar/HrNavbar";
import f from "../../images/f.png";
import deleted from "../../images/deletedd.svg";
import "./employeManage.css";
import { NavLink, useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import actions from "../../images/actions.png"
import happy from "../../images/bx-happy-heart-eyes.png"
import edit22 from "../../images/edit22.png"
import pp from "../../images/pp.png"
import OutsideClickHandler from "react-outside-click-handler";
import toast from "react-hot-toast";
import EmployeeSidebar from "../../Employee/Sidebar/EmployeeSidebar";
import EmployeeNavbar from "../../Employee/Navbar/EmployeeNavbar";


const DeactivateEmployee = ({
  pop1,
  setPop1,
  pop,
  setPop,
  setAlert,
  isHr = false,
}) => {

  const navigate = useNavigate();

  let todayDate = new Date().toLocaleDateString('en-GB');

  const { user, getUsers, getActivitiesByUser, deleteUser,getDepartments,getDesignations } = useMain();

  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredData = data.filter((item) => item.designation !== "CEO" && item._id !== user._id && item?.isDeactivated == "Yes");
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  let hrms_user = JSON.parse(localStorage.getItem("hrms_user"));
  let hrms_permission = JSON.parse(localStorage.getItem("hrms_permission"));

   const {role } = hrms_user;
   const {  employeeManageEditPermission , employeeManageActivatePermission} = hrms_permission;

  const [allData , setAllData] = useState([]);

  const [refreshFlag, setRefreshFlag] = useState(false);

  const [currView, setCurrView] = useState(-1);

  const [filters , setFilters] = useState({
    department:"Department",
    designation:"Designation" , 
    employeeType:"Employee Type"
  })

  const [department,setDepartment] = useState([]);

  const [designation,setDesignation] = useState([]);

  const fetchDesig = async()=>{
      const ans = await getDesignations();
      setDesignation(ans?.data);
  }
  

  const getData = async () => {
    const ans = await getUsers();
  
    const reversedData = ans?.data?.slice().reverse(); 
    setAllData(reversedData);
    setData(reversedData);
  };
  
  const getDep = async () =>{
    const ans = await getDepartments();
    setDepartment(ans?.data);
  }

  const getData1 = async (date) => {
    const data = await getActivitiesByUser(date, '', '', 0, 10, '');
  };

  const deleteUser1 = async (id , isDeact) => {

    confirmAlert({
      title: `Are you sure you want to ${isDeact?"Activate":"Deactivate"} this Person?`,
      buttons: [
        {
          label: `${isDeact?"Activate":"Deactivate"}`,
          style: {
            background: "#DD3409"
          },
          onClick: async () => {
            await deleteUser(id);
            toast.success(`${isDeact?"Activate":"Deactivate"} Successfully`);
            setRefreshFlag(!refreshFlag);
            getData();
          }
        },
        {
          label: 'Cancel',
          style:{
            background:"none",
            border:"1px solid #0B56E4",
            color:"#0B56E4",
          },
          onClick: () => null
        }
      ]
    });

  };

  const  filterHandler = (e)=>{
    const {name , value} = e.target;

     setFilters((prev)=>({
      ...prev ,
      [name]: value
     }))

  }
  
  useEffect(() => {
    getData();
    fetchDesig();
    getDep();
  }, [refreshFlag]);

  useEffect(() => {
    getData1(todayDate);
  }, []);

  useEffect(() => {
    const completeData = [...allData];

    const filterData = completeData.filter((data) => {
        return (
            (filters.department === "Department" || data.department === filters.department) &&
            (filters.designation === "Designation" || data.designation === filters.designation) &&
            (filters.employeeType === "Employee Type" || data.EmployeeType === filters.employeeType)
        );
    });

    setCurrentPage(1);
    setData(filterData);
}, [filters.department, filters.designation, filters.employeeType]);

const [checkInpId , setCheckInpId] = useState([]);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scrolling
  });
};

const srchEmpFunction = (e)=>{
   const value = e.target.value;
   setCurrentPage(1);
    if(value === ""){
   setData(allData);
    }
    else{
      const completeData = [...allData];
      console.log("comp;ete" , completeData);
      const filter = completeData.filter((data) =>  data?.fullName?.toLowerCase()?.includes(value.toLowerCase()) );
      console.log("filter" , filter);
      setData(filter);
        }
}

const checkallinput = () => {
  const idList = allData.map((d) => d?._id); 
  setCheckInpId(idList);
};


  return (
    <>
      <div className="employee-dash h-full">
        {isHr ? <HrSidebar /> : 
        
          role=== "EMPLOYEE" ?
          <EmployeeSidebar pop={pop} setPop={setPop} />
           :
        <AdminSidebar pop={pop} setPop={setPop} />
        
        }
        <div className="tm">
          {isHr ? (
            <HrNavbar
              user={user}
              setAlert={setAlert}
              pop1={pop1}
              setPop1={setPop1}
            />
          ) : (
            
              role === "EMPLOYEE" ?
               <EmployeeNavbar user={user} setAlert={setAlert}  />:
  
            <AdminNavbar user={user} setAlert={setAlert} />
            
  
          )}

          <div className="em">
            <div className="flex-col">

              {/* first  */}
             
              <div className="hrmsFri">

                <h2>Deactivate Employee Management</h2>
                
                {/* right  */}
                <div className="hrFRi">
                 <NavLink to="/adminDash/EmployeeMan"><button className="ddBtn">
                    <img src={pp} alt="" />
                    <span>Add Employee</span>
                  </button></NavLink>
                  {/* <img src={f} alt="" /> */}
                </div>

              </div>

              {/* filter section  */}
              <section className="fiterWrap">

                <h3>Filter by</h3>

                <p className="line" />

                <select name="department" onChange={filterHandler} id="">
                  <option value="Department">Department</option>
                  {
                     department?.map((val,index)=>{
                      return <option key={index} value={val?.name}>{val?.name}</option>
                     })
                  }
                </select>

                <p className="line" />

                <select name="designation" onChange={filterHandler} id="">
                  <option value="Designation">Designation</option>
                  {
                     designation?.map((val,index)=>{
                      return <option key={index} value={val?.name}>{val?.name}</option>
                     })
                  }
                </select>

                <p className="line" />


                <select name="employeeType" className="employetypeselect" onChange={filterHandler} id="">
                  <option value="Employee Type">Employee Type</option>
                  <option value="Full-time Employees">Full-time Employees</option>
                  <option value="Intern Employees">Intern Employees</option>
                  <option value="Freelancer Employees">Freelancer Employees</option>
                </select>


                <p className="line" />

              </section>


              {/* second */}

              <p className="totalRecord">Total Records {data?.length}</p>

              <main className="creteEmpWrap2">

                <div className="EllWrap">

                  <div className="allEtOL">
                    <p className="hhj">All Employee</p>

                    <div className="deletwrP">
                     
                      <input type="text" placeholder="Search..." className="emsearchi" onChange={(e)=>srchEmpFunction(e)}  />
                    </div>
                  </div>

                </div>

                <div className="relative  overflow-x-auto w-full">

                  <table className="w-full table1 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                    <thead className="text-xs uppercase textALLtITL ">
                      <tr>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                          <input onClick={()=>{
                             if(checkInpId?.length === allData?.length){
                                setCheckInpId([]);
                             }
                             else{
                              checkallinput();
                             }
                          }} checked={checkInpId?.length === allData.length} type="checkbox" className="checkboxes" />

                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                          EMPLOYEE NAME
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                          EMAIL
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                          DEPARTMENT
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                          DESIGNATION
                        </th>
                        <th scope="col" className="px-6 py-3 taskTitl ">
                          DATE OF JOIN
                        </th>

                        <th scope="col" className="px-6 py-3 taskTitl ">
                          ACTION
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        paginatedData.filter(x => x.designation !== "CEO" && x._id !== user._id && x.isDeactivated == "Yes")?.map((item, index) => (
                          <tr key={index} className="bg-white border-b fdf">
                            <th scope="col" className="px-6 py-3 taskTitl ">
                              <input onClick={()=>{
                                 if(checkInpId.includes(item?._id)){
                                  const filterdata = checkInpId.filter((id)=> id !== item?._id);
                                  setCheckInpId(filterdata);
                                 }
                                 else{
                                  setCheckInpId((prev) => [...prev, item?._id]); 
   }
                              }} checked={checkInpId.includes(item?._id)} type="checkbox" className="checkboxes" />

                            </th>
                            <th scope="row" className="px-6 py-4   "><span className="index cursor-pointer">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                              </span> </th>
                            <td className="px-6 py-4 taskAns">{item?.fullName}</td>
                            <td className="px-6 py-4 taskAns">{item?.email}</td>
                            <td className="px-6 py-4 taskAns">{item?.department}</td>
                            <td className="px-6 py-4 taskAns">{item?.designation}</td>
                            <td className="px-6 py-4 taskAns">{item?.joiningDate}</td>

                            <OutsideClickHandler
                              onOutsideClick={()=>{
                                if (index == currView) {
                                  setCurrView(-1);
                                } 
                              }}
                            >
                            <div className="viewOnwWRAP">

                              <td onClick={() => {
                                if (index == currView) {
                                  setCurrView(-1);
                                }
                                else {
                                  setCurrView(index)
                                }
                              }} className="px-6 py-4 taskAns cursor-pointer"><img src={actions} alt="" /></td>


                              {
                                index == currView &&

                                <div className=" viewOne">
                                  {/* first  */}
                                  <div onClick={()=>navigate("/adminDash/EmployeeDetails" , {state:item?._id})} className="subView">
                                    <img src={happy} alt="" />
                                    <p>View</p>
                                  </div>

                                  <hr />

                                  {/* second */}
                                  {
                                     (employeeManageEditPermission || role === "ADMIN") && 
                                  
                                  <div onClick={() => {
                                    navigate(`/adminDash/EmployeeMan/${item._id}`);
                                  }} className="subView">
                                    <img src={edit22} alt="" />
                                    <p>Edit </p>
                                  </div>

                                }

                                  <hr />

                                  {/* third */}
                                  {
                                    (employeeManageActivatePermission || role === "ADMIN") && 
                                  
                                  <div onClick={() => {
                                    deleteUser1(item?._id , item?.isDeactivated === "Yes");
                                  }} className="subView">
                                    <img src={deleted} alt="" />
                                    <p className="deel"> {item?.isDeactivated === "Yes"?"Activate":"Deactivate"} </p>
                                  </div>
}
                                </div>

                              }
                            </div>
                            </OutsideClickHandler>
                          </tr>
                        ))
                      }



                    </tbody>

                  </table>
                </div>

              </main>


            </div>

            <div className="emPaginate">
        <button className={`prepaginate ${currentPage !== 1 && "putthehovebtn"}`} onClick={() => {
          handlePageChange(currentPage - 1);
           scrollToTop();
        }} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="pagenum">Page {currentPage} of {totalPages}</span>
        <button className={`prepaginate ${currentPage !== totalPages && "putthehovebtn"} `} onClick={() => {
          handlePageChange(currentPage + 1)
          scrollToTop();

        }} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeactivateEmployee;
