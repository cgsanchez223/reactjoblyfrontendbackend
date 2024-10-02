import React, { useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import JoblyApi from "./api";


const EditUser = ({ editUser, currentUser, token }) => {
    const params = useParams()
    const [isLoaded, setIsLoaded] = useState(false)
    const [userData, setUserData] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        async function getProfile() {
            const response = await JoblyApi.getUser(currentUser, token)
            setUserData(response)
        }
        getProfile()
        setIsLoaded(true)
    }, [isLoaded])

    const INITIAL_STATE = {
        firstname: userData?.user.firstname || '',
        lastname: userData?.user.lastname || '',
        email: userData?.user.email || ''
    };

    const [formData, setFormData] = useState(INITIAL_STATE);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.firstname.trim() === '' ||
            formData.lastname.trim() === '' ||
            formData.email.trim() === ''
        ) {
            alert("Please fill out all fields");
            return;
        }

        if(formData.password !== formData.confirmPassword) {
            alert('Passwords do not match')
            return;
        }

        try {
            await editUser(formData, params.username);
            setFormData(INITIAL_STATE);
            alert(`Successfully changed profile for ${params.username}`)
            navigate('/')
        } catch (error) {
            console.error("Error editing user:", error);
            alert("Failed to edit user");
        }
    };

    return (
        <Card>
            <CardBody>
                <CardTitle><h1>Edit Profile:</h1></CardTitle>

                <form onSubmit={handleSubmit}>
                    <div className="form-group p-2">
                        <label htmlFor="firstname">First name: </label>
                        <input
                            id="firstname"
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group p-2">
                        <label htmlFor="lastname">Last name: </label>
                        <input
                            id="lastname"
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group p-2">
                        <label htmlFor="email">Email: </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <button type='submit' className="btn btn-primary p-2">Confirm changes</button>
                </form>
            </CardBody>
        </Card>
    );
};

export default EditUser;