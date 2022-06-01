import {useEffect, useState} from "react";
import {FaUser} from "react-icons/fa"
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const {name, email, password} = formData;


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            password
        }

        const res = await fetch(
            process.env.REACT_APP_API_URL + "/users/signup",
            {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(userData),
                headers: { "Content-type": "application/json;charset=UTF-8" },
            }
        );
        navigate("/login")
    }


    return (
        <>
            <section className='heading d-flex justify-content-center mt-3'>
                <h1>
                    <FaUser/> Register
                </h1>
            </section>
            <section className='d-flex justify-content-center'>
                <h3>Please create an account</h3>
            </section>

            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input className="form-control" id="name" name="name" value={name}
                               placeholder="Enter your name" onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <input className="form-control" id="email" name="email" type="email" value={email}
                               placeholder="Enter your email" onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <input className="form-control" id="password" name="password" type="password" value={password}
                               placeholder="Enter your password" onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-block btn-dark" type="submit">Register</button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Signup;