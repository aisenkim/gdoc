import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
    })

    const [docIds, setDocIds] = useState([]);

    const {name} = formData;

    async function fetchDocList() {
        const res = await fetch(
            process.env.REACT_APP_API_URL + "/collection/list",
            {
                credentials: "include",
                method: "GET",
                headers: {"Content-type": "application/json;charset=UTF-8"},
            }
        );
        const data = await res.json();
        console.log(data)
        if(!data.error) {
            setDocIds(data); // array of 10 recently updated docs
        }
        if(data.error)
            navigate("/login")
        // console.log(data.list);
    }

    useEffect(() => {
        fetchDocList();
    }, []);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name
        }

        const res = await fetch(
            process.env.REACT_APP_API_URL + "/collection/create",
            {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(userData),
                headers: {"Content-type": "application/json;charset=UTF-8"},
            }
        );
        const data = await res.json();
        if(!data.error) {
            fetchDocList()
        }
        console.log(data)
    }

    const logoutEvent = async (e) => {
        console.log("Logout event processing")
        const res = await fetch(
            process.env.REACT_APP_API_URL + "/users/logout",
            {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({}),
                headers: {"Content-type": "application/json;charset=UTF-8"},
            }
        );
        const data = await res.json();
        navigate("/login")
        console.log(data)
    }

    const deleteDoc = async (docid) => {
        console.log("Deleting doc")
        console.log(docid)

        const res = await fetch(
            process.env.REACT_APP_API_URL + "/collection/delete",
            {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({docid}),
                headers: {"Content-type": "application/json;charset=UTF-8"},
            }
        );
        const data = await res.json();
        if(!data.error) {
            fetchDocList()
        }
        console.log(data)
    }

    const editDoc = async (docid) => {
        console.log("Editing doc")
        console.log(docid)

        // JUST FOR TESTING IN LOCAL
        navigate(`/doc/edit/${docid}`)

        /**
        const res = await fetch(
            process.env.REACT_APP_API_URL + `/doc/edit/${docid}`,
            {
                credentials: "include",
                method: "GET",
                headers: {"Content-type": "application/json;charset=UTF-8"},
            }
        );
        const data = await res.json();
        console.log(data)
         */
    }



    return (
        <>
            <section className='heading d-flex justify-content-center mt-3'>
                <h1>
                    The Most Recently Modified 10 Documents
                </h1>
            </section>
            <ul>
                {
                    docIds.map(doc => {
                        return (
                            <li>
                                {doc.name} - <button onClick={() => editDoc(doc.docid)}>edit doc</button> - <button onClick={() => deleteDoc(doc.docid)}>Delete Doc</button>
                            </li>
                        )
                    })
                }
            </ul>

            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input className="form-control" id="name" name="name" value={name}
                               placeholder="Enter your name" onChange={onChange}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-block btn-dark" type="submit">Create Doc</button>
                    </div>
                </form>
            </section>
            <section>
                <button onClick={logoutEvent} className="btn btn-block btn-dark" type="Logout">logout</button>
            </section>
        </>
    );
}

export default Home;