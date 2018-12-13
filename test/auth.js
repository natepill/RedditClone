const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should()
chai.use(chaiHttp);


var agent = chai.request.agent(server) // Going to act as our request triggerer