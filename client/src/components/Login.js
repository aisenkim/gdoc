import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const {email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    console.log(userData)
    const res = await fetch(
        process.env.REACT_APP_API_URL + "/users/login",
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify(userData),
          headers: { "Content-type": "application/json;charset=UTF-8" },
        }
    );

    const data = await res.json();
    // navigate
    navigate("/home")
  };

  return (
    <>
      <section className="heading d-flex justify-content-center mt-3">
        <h1>
          <FaUser /> Login
        </h1>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              type="email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              id="password"
              name="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block btn-dark" type="submit">
              Login
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
