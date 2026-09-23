import {INestApplication} from "@nestjs/common";
// @ts-ignore
import {App} from "supertest/types";
import {ServiceRequestStatus} from "../src/modules/service-req/entity/service-req.enums.js";

describe("AppController (e2e)", () => {
    let app: INestApplication<App>;

    // beforeEach(async () => {
    //     const moduleFixture: TestingModule = await Test.createTestingModule({
    //         imports: [AppModule],
    //     }).compile();
    //
    //     app = moduleFixture.createNestApplication();
    //     await app.init();
    // });

    it("should be defined", () => {
        console.log(ServiceRequestStatus.NEW);
    });

    // it("/ (GET)", () => {
    //     return request(app.getHttpServer())
    //         .get("/")
    //         .expect(200)
    //         .expect("Hello World!");
    // });
    //
    // afterEach(async () => {
    //     await app.close();
    // });
});
