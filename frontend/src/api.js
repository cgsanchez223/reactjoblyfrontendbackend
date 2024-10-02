import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get", token=JoblyApi.token) {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${token}` };
    const params = method === "get" 
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let response = await this.request(`companies/${handle}`);
    return response.company;
  }

  // obviously, you'll add a lot here ...
  // Get all companies
  static async getCompanies() {
    let response = await this.request(`companies`);
    return response.companies;
  }

  // Get list of companies by name or be able to filter partial matches
  static async filterCompanies(name) {
    let response = await this.request(`companies?name=${name}`);
    return response.companies;
  }

  // Add a new company
  static async postCompany({ handle, name, description, numEmployees, logoUrl }) {
    let response = await this.request(`companies/`, { handle, name, description, numEmployees, logoUrl }, 'post');
    return response.company;
  }

  // Be able to update company
  static async patchCompany({ handle, name, description, numEmployees, logoUrl }) {
    let response = await this.request(`companies/${handle}`, { handle, name, description, numEmployees, logoUrl }, 'patch');
    return response.company;
  }

  // Be able to delete a company
  static async deleteCompany(handle) {
    let response = await this.request(`companies/${handle}`, {}, 'delete');
    return response.company;
  }


  // User login handling section
  // Handles logging in
  static async login(username, password) {
    let response = await this.request(`auth/token`, {username, password}, 'post');
    return response;
  }

  // Get a user by the id
  static async getUser(username, token) {
    let response = await this.request(`users/${username}`, {}, 'get', token);
    return response;
  }

  // Be able to get all users
  static async getAllUsers(token) {
    let response = await this.request(`users/`, {}, 'get', token);
    return response.users;
  }

  // Be able to add a new user
  static async register({ username, password, firstName, lastName, email }) {
    let response = await this.request(`auth/register`, {username, password, firstName, lastName, email}, 'post');
    return response;
  }

  // Be able to add authentication for Todo as admin
  static async authenticateUserAdmin({ user, token }) {
    let response = await this.request(`users/`, {user, token}, 'post');
    return response.user;
  }

  // Be able to search users with a matching id. Also includes partial matches in search results
  static async filterUsers(id) {
    let response = await this.request(`users?id=${id}`);
    return response.users;
  }

  // Be able to update a user by their id
  static async patchUser(data, username, token) {
    let response = await this.request(`users/${username}`, data, 'patch', token);
    return response.company;
  }

  // Be able to delete a user by their id
  static async deleteUser(id) {
    let response = await this.request(`users/${id}`, {}, 'delete');
    return response;
  }


  // Job Handling Section
  // Be able to get a job by the id
  static async getJob(id) {
    let response = await this.request(`jobs/${id}`);
    return response.job;
  }

  // Brings up all jobs
  static async getAllJobs() {
    let response = await this.request(`jobs`);
    return response.jobs;
  }

  // Bring up all jobs that match the title, including partial matches
  static async filterJobs(title) {
    let response = await this.request(`jobs?title=${title}`);
    return response.jobs;
  }

  // Get all jobs by company
  static async filterJobsByCompany(company_handle) {
    let response = await this.request(`jobs`);
    let filteredJobs = response.jobs.filter((e) => e.companyHandle === company_handle);
    return filteredJobs;
  }

  // Section for adding a new job
  // Add authentication through Todo
  static async postJob({ title, salary, equity, companyHandle }) {
    let response = await this.request(`jobs/`, { title, salary, equity, companyHandle }, 'post');
    return response.job;
  }

  // Be able to update details of a job by their id
  static async patchJob({ title, salary, equity }) {
    let response = await this.request(`jobs/`, { title, salary, equity }, 'patch');
    return response.user;
  }

  // Be able to delete a job by its id
  static async deleteJob(id) {
    let response = await this.request(`jobs/${id}`, {}, 'delete');
    return response;
  }
}

// for now, put token ("testuser" / "password" on class)
JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;