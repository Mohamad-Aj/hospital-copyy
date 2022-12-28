const request = require("supertest");
const app = require("../app");
const doctorRouter = require('../routes/doctor')

describe("Test the root path", () => {
    test("It should response the GET method", done => {
        request(app)
            .get("/")
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});

describe("POST /register", () => {
    it("Should be status code 302", async () => {
        const newUser = await request(app).post("/register").send({
            fullname: "A",
            birthdate: new Date(),//json.toString(req.body.birthdate),
            email: "A@gmail.com",
            password: "123456",
            id1: "2141251",
            phonenumber: "0528462345",
            gender: "Male",


        });
        console.log(newUser.statusCode)
        expect(newUser.statusCode).toBe(302);
    })
})


describe("POST /doctor/login", () => {
    it("Should respond 'login ok", async () => {
        const newUser = await request(app).post("/doctor/login").send({
            email: 'mohamadaj310@gmail.com',
            password: 'alonnsael12A'

        });
        expect(newUser.statusCode).toBe(200);
    })
})


