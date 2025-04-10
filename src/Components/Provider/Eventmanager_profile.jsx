import React, { useEffect, useState } from 'react'


const Eventmanager_profile = () => {

  // Retrieve manager information from localStorage
  const manager = JSON.parse(localStorage.getItem('manager-info'));
  console.log(manager)

  // Initialize manager state with manager information if available
  const [Manager, setManager] = useState(manager || {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phno: ''
  });

  // Ensure manager is not null before accessing properties
  useEffect(() => {
    if (manager) {
      setManager({
        user_id: manager.user_id,
        name: manager.name,
        email: manager.email,
        mobile_no: manager.mobile_no,
      });
    }
  }, [manager]);
  
  


  return (
    <>


<div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              />
              <span className="font-weight-bold">{manager.name} </span>
              <span className="text-black-50">{manager.email}</span> <br /><br /><br /><br /><br /><br />
            </div> 
          </div>
          <div className="col-md-5 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="text-right">Profile</h1>
              </div>
              <div className="row mt-2">
                <div className="col-md-12">
                  <label className="labels">Name: - {manager.name}</label>
                </div>
              </div><br />
              <div className="col-md-12">
                <label className="labels">Mobile Number:- {manager.mobile_no}</label>
              </div><br />
              <div className="col-md-12">
                <label className="labels">Email ID:- {manager.email}</label>
              </div><br />
              <div className="col-md-12">
                <label className="labels">City:- Surat</label>
              </div><br />
              <div className="col-md-12">
                <label className="labels">State:- Gujrat</label>
              </div><br />
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 py-5">
              <div className="col-md-12"><br /><br /><br /><br /><br /><br /><br /><br />
                <h1 className="labels d-flex justify-content-center">DATA NOT FOUND</h1>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default Eventmanager_profile;
