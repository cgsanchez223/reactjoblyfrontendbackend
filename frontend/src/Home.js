import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

export default function Home() {
    return (
        <section className="col home">
            <Card className="home">
                <CardBody className="text-center">
                    <CardTitle>
                        <h3 className="font-weight-bold">
                            Welcome to Jobly!
                        </h3>
                    </CardTitle>
                </CardBody>
            </Card>
        </section>
    );
}