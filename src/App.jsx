import "./App.css";
import {useState} from "react";

const App=()=>{
  const [page,setPage]=useState("login");
  return(
    <>
    <header>
      <h2>Student management </h2>
      <nav>
        <a href="#login">Login</a>
        <a href="#signup">Signup</a>
        </nav>
     </header>
     <section id="login" className="card">
      <form onSubmit={login}>

      <h1>Account login</h1>
      <label>Email address</label>
      <input type="email" placeholder="Email Address"/>
      <label>password</label>
      <input type="password" placeholder="passowrd"/>
       </form>
      <a href="#forgot">forgot password </a>
      <button>Login</button>
      <p>new Student?<a href="#signup">Create account</a></p>
      </section>
      
     
      <section id="signup" className="cardwide">
        <h1>Student signup Form</h1>
        <div className="grid">
          
          
          <div>
            <label>Name *</label>
            <input type="text"/>
          </div>
          <div>
            <label>Email *</label>
            <input type="email"/>
          </div>
          <div>
            <label>Password</label>
            <input type="Password"/>
          </div>
         
         
          <div>
            <label>Date of birth *</label>
            <input type="date"/>
            </div>
            
            
            <div>
              <label>Gender *</label>
              <div className="options">
                <label>
                  <input type="radio" name="gender"/>Male </label>

              </div>
            </div>
            <div>
              <label> Qualification </label>

              
              <select>
                <option>Sekect qualification</option>
                <option>gigh school </option>
                 <option>diploma</option>

                  <option>B.tech</option>
                 
                   <option>masters</option>
            
            
              </select>
            </div>
            <div>
              <label>class *</label>
              <input type="text"/>
            </div>
            <div>
              <label>Subject</label>
               <input type="text"/>
              
            </div>
             <div>
              
              
              <label>Marks</label>
               <input type="number"/>
              
            </div>
            <label>intersts</label>
            <div className="options"></div>
            <label>
              <input type="checkbox"/>
              Coding
            </label>
            <div>
            <label>Adhar card</label>
            <input type="file" accept=".pdf"/>
            </div>
            <button>Register</button>
            <button>you have account? Login</button>


        </div>
      </section>
      <section id="forgot" className="card">
        <h1>Forgot password</h1>
        <label>Registerd email</label>
        <input type="Email"/>

        <button>Reste password</button>
        <p><a href="login"> go Back to login</a></p>
        </section>
        {/* Student dashboard */}
        
        
        
        
        <section className="wide">
          <div className="welcome"></div>
          <h1>Welcome john doe</h1>
          <p>student profile</p>
          <button>Edit profile</button>
          <p><b>Email</b>Jogn@gmail.com</p>
          <p>date of birth </p>
          <p>Gender male</p>
          <p>Qualification</p>
          <p><b>Aadhar</b><a href="#">Open pdf</a></p>


        </section>
        {/* Admin dashboard */}
        <section  className="wide">
          <h1>Admin dashboard</h1>
          <div className="table-box">
            <table>
              <thead>
                <tr>
                  <th>ID </th>
                  <th>NAme</th>
                  <th>Email</th>
                  <th>class</th>
                  <th>marks</th>
                  <th>Actions</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>hon doe</td>
                  <td>Email</td>
                  <td>B.tech</td>
                  <td>80%</td>
                  <td> fresher</td>
                </tr>
              </tbody>
            </table>
            <button>Edit</button>

          </div>

        </section>
        
    </>
  )
}
export default App;