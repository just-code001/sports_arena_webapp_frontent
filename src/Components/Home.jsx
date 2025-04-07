import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import background from "../Photos/test4.jpg";

const Register = () => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
    //   style={{ 
    //     backgroundImage: `url(${background})`, 
    //     backgroundSize: "cover", 
    //     backgroundPosition: "center", 
    //     backdropFilter: "blur(5px)",
    //     top:"0"
    //   }}
    >
      <div className="p-5 rounded-4 shadow-lg w-100" style={{
        maxWidth: "420px",
        background: "linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 51, 102, 0.8))",
        backdropFilter: "blur(20px)",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        color: "#fff",
        textAlign: "center"
      }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "#ffcc00", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>Registration</h2>
        <form>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>Full Name</label>
            <input type="text" className="form-control rounded-3 border-0 bg-light text-dark" required />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>Phone number</label>
            <input type="phno" className="form-control rounded-3 border-0 bg-light text-dark" required />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>Email</label>
            <input type="email" className="form-control rounded-3 border-0 bg-light text-dark" required />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#ffcc00" }}>Password</label>
            <input type="password" className="form-control rounded-3 border-0 bg-light text-dark" required />
          </div>
          <button type="submit" className="btn w-100 rounded-3" style={{ background: "#ffcc00", border: "none", color: "#000", fontWeight: "bold", boxShadow: "0 4px 7px rgba(255, 204, 0, 0.7)" }}>Register</button>
        </form>
        <p className="text-center mt-3" style={{ color: "#ffcc00" }}>
          Already have an account? <a href="/login" className="text-warning fw-bold">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
// import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import background from "../Photos/test4.jpg";

// const Login = () => {
//   return (
//     <div
//       className="min-vh-100 d-flex align-items-center justify-content-center"
//       style={{ 
//         backgroundImage: `url(${background})`, 
//         backgroundSize: "cover", 
//         backgroundPosition: "center", 
//         backdropFilter: "blur(5px)"
//       }}
//     >
//       <div className="p-5 rounded-4 shadow-lg w-100" style={{
//         maxWidth: "420px",
//         background: "linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 51, 102, 0.8))",
//         backdropFilter: "blur(20px)",
//         border: "2px solid rgba(255, 255, 255, 0.3)",
//         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
//         color: "#fff",
//         textAlign: "center"
//       }}>
//         <h2 className="text-center fw-bold mb-4" style={{ color: "#ffcc00", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>Login</h2>
//         <form>
//           <div className="mb-3">
//             <label className="form-label" style={{ color: "#ffcc00" }}>Email</label>
//             <input type="email" className="form-control rounded-3 border-0 bg-dark text-white" required />
//           </div>
//           <div className="mb-3">
//             <label className="form-label" style={{ color: "#ffcc00" }}>Password</label>
//             <input type="password" className="form-control rounded-3 border-0 bg-dark text-white" required />
//           </div>
//           <button type="submit" className="btn w-100 rounded-3" style={{ background: "#ffcc00", border: "none", color: "#000", fontWeight: "bold", boxShadow: "0 4px 15px rgba(255, 204, 0, 0.7)" }}>Login</button>
//         </form>
//         <p className="text-center mt-3" style={{ color: "#ffcc00" }}>
//           Don't have an account? <a href="/register" className="text-warning fw-bold">Register</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
