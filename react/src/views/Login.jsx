// // import React from 'react'

// // export default function Login() {
// //   return (
// //     <div>Login</div>
// //   )
// // }

// import { useRef, useState } from 'react';
// import LoginInput from "../components/LoginInput/LoginInput.jsx";

// const Login = () => {
//     // const [username, setUsername] = useState(""
//     // const usernameRef = useRef()
//     // const passwordRef = useRef()

//     const [values, setValues] = useState({
//         username: "",
//         password: ""
//     });

//     const inputs = [
//         {
//             id: 1,
//             name: "username",
//             type: "text",
//             placeholder: "Username",
//             errorMessage: "Username is required.",
//             label: "Username",
//         },
//         {
//             id: 2,
//             name: "password",
//             type: "password",
//             placeholder: "Password",
//             errorMessage: "Password is required.",
//             label: "Password"
//         }
//     ]
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(values)
//     }

//     const onChange = (e) => {
//         setValues({ ...values, [e.target.name]: e.target.value })
//     }


//     return (
//         <div className="loginForm">
//             <form onSubmit={handleSubmit}>
//                 <h1>Login</h1>
//                 {inputs.map((input) => (
//                     <LoginInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
//                 ))}
//                 {/* <LoginInput refer={usernameRef} placeholder="Littleroot" label="Username" />
//                 <LoginInput refer={passwordRef} placeholder="Azalea" label="Password" /> */}
//                 <button>Submit</button>
//             </form>
//         </div>
//     );
// };

// export default Login;

import React from 'react'
import { Link } from 'react-router-dom'

const onSubmit = (event) => {
  event.preventDefault()
}

export default function Login() {
  return (
    <div className='login-signup-form animated fadeInDown'>
      <div className='form'>
        <form onSubmit={onSubmit}>
          <h1 className='title'>
            Login into your account
          </h1>
          <input type ="email" placeholder='Email' />
          <input type ="password" placeholder='Password' />
          <button className='btn btn-block'>Login</button>
          <p className='message'>
            Not Registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
      
    </div>
  )
}
