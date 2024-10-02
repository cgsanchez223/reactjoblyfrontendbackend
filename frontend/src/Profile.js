import { Card, CardBody, CardTitle } from "reactstrap";
import JoblyApi from "./api";
import { useState, useEffect } from "react";
import { CardComponent } from "./routesList";

export function Profile({ currentUser, token }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        async function getProfile() {
            const response = await JoblyApi.getUser(currentUser, token)
            setUserData(response)
        }
        getProfile()
        setIsLoaded(true)
    }, [isLoaded])

    return (
        <section>
            {isLoaded && userData ?
            <section>
                
                <CardComponent type="users" user={userData.user.username} />
                </section>
            :
            <section>Error: Could Not Load</section>
        }
        </section>
    )
}