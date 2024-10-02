import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useLocation } from "react-router-dom";
import { List } from "./routesList"
import './Page.css'



// Home page. Has routes to render Home, users, companies and jobs
export default function Page() {
    let location = useLocation();

    location = location.pathname.split('/')[1]
    return (
        <div className="page" >
            <section className="col">
                <Card>
                    <CardBody className="text-center">
                        <CardTitle>
                            <h3 className="font-weight-bold">
                                Welcome to {location.slice(0,1).toUpperCase() + location.slice(1)}!
                            </h3>
                        </CardTitle>
                    </CardBody>
                </Card>
            </section>
            <hr />
            <List type={location} />
        </div>
    );
}