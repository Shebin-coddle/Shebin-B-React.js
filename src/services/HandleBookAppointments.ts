import type { NavigateFunction } from "react-router-dom";
import { showWarning } from "../utils/toast";

export function HandleBookAppointments(navigate:NavigateFunction,roleId:number|null){

  if(!roleId){
    navigate("/login");
    showWarning("Login to book appointment")
    return
  }

  if(roleId===3){
    navigate("/doctor-list");
    return;
  }


  showWarning("Only patients can book appointments")
}