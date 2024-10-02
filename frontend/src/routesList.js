import React, { useState, useEffect } from "react";
import JoblyApi from "./api";
import { Link, useLocation, useParams } from "react-router-dom";
import { CardBody, CardTitle, Card } from "reactstrap";

// Lists the routes:
// /companies, /jobs, /users

export function List({ type }) {

    // Be able to store jobs that were previously applied for
    if(!localStorage.applied || localStorage.applied.length == 0) localStorage.applied = []
    const [jobsApplied, setJobsApplied] = useState(localStorage.applied || [])

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const location = useLocation();

    // gets data from different types companies, jobs, users
    async function getItems() {
        let items;
        switch (type) {
            case "companies":
                items = await JoblyApi.getCompanies();
                break;
            case "jobs":
                items = await JoblyApi.getAllJobs();
                break;
            case "users":
                items = await JoblyApi.getAllUsers(localStorage.token);
                break;
            default:
                console.log("Invalid type");
                items = [];
                break;
        }

        // Sort items by id
        items = items.sort((a, b) => a.id - b.id);

        // Set data, allowing data to then be mapped into items
        setData(items);

        // Disable the loading icon
        setIsLoading(false);
    }

    // get item with useEffect
    useEffect(() => {
        getItems();
    }, [type]);

    // Show loading icon when fetching data from API
    if (isLoading) {
        return <p>Loading &hellip;</p>;
    }

    // Return content
    return (
        <section>
            {/* Directs data to appropriate route */}
            <Search getItems={getItems} location={location} setData={setData} />

            <table className="table table-responsive table-striped">
                <thead>
                    {/* Table for /companies */}
                    {type === "companies" && (
                        <tr>
                            <th scope="col">Company</th>
                            <th scope="col">Number of employees</th>
                            <th scope="col">Description</th>
                        </tr>
                    )}

                    {/* Table for /jobs */}
                    {type === "jobs" && (
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Salary</th>
                            <th>Equity</th>
                            <th></th>
                        </tr>
                    )}

                    {/* Table for /users */}
                    {type === "users" && (
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {data.map((d) => (
                        <Item key={d.id} data={d} type={type} jobsApplied={jobsApplied} />
                    ))}
                </tbody>
            </table>
        </section>
    );
}


// Item - renders items from company, user, job
export function Item({ data, type, jobsApplied='' }) {

    switch(type) {
        case "companies":
            return (
                <tr>
                    <td>
                        {/* Link to company Card */}
                        <Link to={"/companies/" + data.handle}>{data.name}</Link>
                    </td>
                    <td>{data.numEmployees}</td>
                    <td>{data.description}</td>
                </tr>
            );
        case "jobs":
            return (
                <tr>
                    <td>
                        {/* Link to job card */}
                        <Link to={"/jobs/" + data.id}>{data.id}</Link>
                    </td>
                    <td>{data.title}</td>
                    <td>{data?.salary || "N/A"}</td>
                    <td>{data?.equity || "N/A"}/1</td>
                    <td>
                        {jobsApplied.includes(data.id) ? (<td>Already applied!</td>) : (<ApplyButton id={data.id}/>)}
                    </td>
                </tr>
            );

        // Only accessible by admin
        case "users":
            return (
                <tr key={data.username}>
                    <td>{data.username}</td>
                    <td>{data.email}</td>
                </tr>
            );

        default:
            console.log("Invalid type");
            return null;
    }
}


// Search
// Contains search bar
export function Search({ getItems, location, setData }) {
    const [search, setSearch] = useState("");

    return (
        <section>
            <input
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                    setSearch(e.target.value.trim());
                }}
            />
            <button
                className="btn btn-primary"
                onClick={() => {
                    if (search == "") {
                        console.debug("Search bar is empty")
                        return getItems();
                    }
                    async function lookUp() {
                        let searchTerm;

                        switch (location.pathname) {
                            case "/companies":
                                searchTerm = await JoblyApi.filterCompanies(search);
                                setData(searchTerm);
                                break;
                            case "/jobs":
                                searchTerm = await JoblyApi.filterJobs(search);
                                setData(searchTerm);
                                break;
                            case "/users":
                                break;
                            default:
                                break;
                        }
                    }
                    lookUp();
                }}
                >
                    Submit
                </button>
        </section>
    );
}


// CardComponent
export function CardComponent({ type, user, jobsApplied }) {
    const [data, setData] = useState(null);
    const [jobs, setJobs] = useState([]);
    const param = useParams();

    // Using params to get company, username, job ID
    useEffect(() => {
        async function fetchData() {
            let fetchedData, fetchedJobs;
            switch (type) {
                case "companies":
                    fetchedData = await JoblyApi.getCompany(param.title);
                    fetchedJobs = await JoblyApi.filterJobsByCompany(fetchedData.handle);
                    break;
                case "jobs":
                    fetchedData = await JoblyApi.getJob(param.id);
                    fetchedJobs = await JoblyApi.filterJobsByCompany(fetchedData.handle);
                    break;
                case "users":
                    fetchedData = await JoblyApi.getUser(param.username || user, localStorage.token);
                    fetchedData = fetchedData.user
                    break;
                default:
                    fetchedData = null;
                    break;
            }
            setData(fetchedData);

            // Sort by job ID, username, and company name
            try {
                fetchedJobs = fetchedJobs.sort(
                    ((a, b) => a.id - b.id) ||
                      ((a, b) => a.username > b.username) ||
                      ((a, b) => a.name > b.name)
                );
            } catch (e) {}
            setJobs(fetchedJobs);
        }

        fetchData();
    }, [type, param]);

    // Loading
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardBody>
                <CardTitle>
                    <h1>{data.title || data.username || data.name}</h1>
                </CardTitle>

                {/* Company card */}
                {type == "companies" && (
                    <section>
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <td>Employees</td>
                                    <td>Description</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{data.numEmployees}</td>
                                    <td>{data.description}</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <td>Job Id</td>
                                    <td>Title</td>
                                    <td>Salary</td>
                                    <td>Equity</td>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((d) => (
                                    <Item key={d.id} data={d} type="jobs" jobsApplied={jobsApplied} />
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* User card */}
                {type == "users" && (<section>
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <td>First Name</td>
                                <td>Last Name</td>
                                <td>Email</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data.firstName}</td>
                                <td>{data.lastName}</td>
                                <td>{data.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>)}

                {/* Job card */}
                {type == "jobs" && (
                    <section>
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <td>Salary</td>
                                    <td>Equity</td>
                                    <td>Company</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{data.salary}</td>
                                    <td>{data.equity}</td>
                                    <td>
                                        {data?.handle && (
                                            <Link to={`/companies/${data.company.handle}`}>
                                                {data.company.name}
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                )}
            </CardBody>

            <button className="btn">
                {type =='users' && localStorage.isAdmin=='true' &&
                <Link to={"/" + type}>All users<br/></Link>}

                {type == 'users' &&
                <Link to={'/'}>Home<br/></Link>}

                {type !== 'users' &&
                <Link to={'/' + type} >Go back<br/></Link>}

                {(localStorage.user == data.username || localStorage.isAdmin) && type=='users' &&
                    <Link to={'/users/' + data.username + '/edit'}>Edit profile<br/></Link>
                }
            </button>
        </Card>
    );
}


// Button to apply for jobs
export function ApplyButton(id) {
    const [applied, setApplied] = useState(false);

    const handleClick = (e) => {
        const id = e.target.id
        setApplied(true);
        console.log("APPLIED FOR ")
        console.log(id)

        localStorage.setItem('applied', JSON.stringify([...localStorage.applied, id]))
    };

    return (
        <div>
            <button
                className={`btn btn-primary ${applied ? 'btn-danger' : ''}`}
                onClick={handleClick}
                disabled={applied}
                id={id.id}
            >
                {applied ? 'Applied' : 'Apply'}
            </button>
        </div>
    );
};