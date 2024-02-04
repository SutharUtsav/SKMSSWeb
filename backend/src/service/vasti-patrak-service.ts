import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { ReadFilesFromDirectory, RemoveFilesFromDirectory } from "../helper/file-handling";

const sequelize = require('../config/db');
const puppeteer = require('puppeteer');
const PDFMerger = require('pdf-merger-js');
const fs = require('fs')
const path = require('path')
const hb = require('handlebars')
const lodash = require('lodash')

export interface IVastiPatrakService {

    /**
     * Get All Records for VastiPatrak
     */
    GetRecords(): Promise<ApiResponseDto | undefined>;

    /**
     * Generate VastiPatrak 
     * @param htmlContent 
     */
    GenerateVastiPatrak(htmlContent: any): Promise<ApiResponseDto | undefined>

    /**
     * Get VastiPatrak Templates
     */
    GetTempates(): Promise<ApiResponseDto | undefined>;
}


export class VastiPatrakService implements IVastiPatrakService {


    //#region Specific Helper Function

    /**
     * Format data for Vstipatrak
     * @param data 
     * @returns 
     */
    private FormatDataForVastiPatrak(data: any) {
        const groupedData = lodash.groupBy(data, 'kutumb_no')
        const formatedData: any = {
            family: [{}]
        };

        for (const kutumbNo in groupedData) {

            const users = groupedData[kutumbNo].map((user: any, i: number) => {

                const returnUser = {
                    name: user.name,
                    mobileNumber: user.mobileNumber,
                    mainFamilyMemberRelation: user.mainFamilyMemberRelation,
                    married: user.married,
                    birthdate: user.birthdate,
                    education: user.education,
                    occupation: user.occupation,
                    email: user.email,
                    kutumb_member_no: user.kutumb_member_no,
                    number: i + 1,
                }

                return returnUser
            })

            const dataWithUser: any = {
                kutumb_no: kutumbNo,
                surname: groupedData[kutumbNo][0].surname,
                village_no: groupedData[kutumbNo][0].village_no,
                kutumb_members: groupedData[kutumbNo][0].kutumb_members,
                village: groupedData[kutumbNo][0].village,
                villageGuj: groupedData[kutumbNo][0].villageGuj,
                currResidency: groupedData[kutumbNo][0].currResidency,
                mainFamilyMemberName: groupedData[kutumbNo][0].mainFamilyMemberName,
                abode_of_God: groupedData[kutumbNo][0].abode_of_God,
                goddess: groupedData[kutumbNo][0].goddess,
                lineage: groupedData[kutumbNo][0].lineage,
                Residency_Address: groupedData[kutumbNo][0].Residency_Address,
                users: users,
                sponsor: [
                    {
                        imageURL: '../sponsor/image003.jpeg'
                    },
                    {
                        imageURL: '../sponsor/image003.jpeg'
                    }
                ]
            }
            formatedData.family.push(dataWithUser)
        }

        formatedData.family.shift();
        return formatedData;
    }

    //#endregion

    /**
     * Get All Records for VastiPatrak
     */
    public async GetRecords(): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;

        try {

            const results = await sequelize.query(`
SELECT ROW_NUMBER() OVER (PARTITION BY f."village" ORDER BY f."village") AS "kutumb_member_no",
	DENSE_RANK() OVER ( ORDER BY u."familyId") AS "kutumb_no",
	DENSE_RANK() OVER ( ORDER BY f."village") AS "village_no",
	COUNT(*) OVER (PARTITION BY u."familyId" ORDER BY u."familyId") AS "kutumb_members",
	f."village" as "village",
	f."villageGuj" as "villageGuj",
	f."currResidency" as "currResidency",
	(SELECT us."name" from "User" as us WHERE us."id"=u."mainFamilyMemberId") as "mainFamilyMemberName",
	f."adobeOfGod" as "abode_of_God",
    f."surname" as "surname",
	f."goddess" as "goddess",
	f."lineage" as "lineage",
	f."residencyAddress" as "Residency_Address",
	u."name" as "name",
	u."mobileNumber" as "mobileNumber",
	u."mainFamilyMemberRelation" as "mainFamilyMemberRelation",
	u."marriedStatus" as "married",
	u."birthDate" as "birthdate",
	u."education" as "education",
	u."occupation" as "occupation",
	u."email" as "email",
	u."motherName" as "motherName",
	u."fatherName" as "fatherName"
	FROM "UserProfile" as u JOIN "Family" as f ON u."familyId" = f."id" ORDER BY f."village" ASC;
`);

            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = results[0];

            return apiResponse;
        }
        catch (error: any) {
            console.log(error)
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }


    /**
     * Generate VastiPatrak 
     * @param htmlContent 
     */
    public async GenerateVastiPatrak(htmlContent: any): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            const response: ApiResponseDto | undefined = await this.GetRecords();

            if (!response || response.status === 0) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                errorDto.errorCode = '400';
                errorDto.errorMsg = "Can't Fetch Records for Vastipatrak";
                apiResponse.status = 0;
                apiResponse.error = errorDto;
                return apiResponse;
            }


            const data = await this.FormatDataForVastiPatrak(response.data)


            const VasriPatrakFolderPath = 'VastiPatrak/pdfs';

            await RemoveFilesFromDirectory(VasriPatrakFolderPath);

            if (!fs.existsSync(VasriPatrakFolderPath)) {
                fs.mkdirSync(VasriPatrakFolderPath, { recursive: true });
            }

            const browser = await puppeteer.launch({
                headless: 'new'
            });
            await Promise.all(data.family.map(async (entry: any, i: number) => {
                const template = hb.compile(htmlContent, { strict: true })
                const result = template(entry)

                const html = result;

                const page = await browser.newPage();
                await page.setContent(html);

                await page.pdf({
                    path: path.join(VasriPatrakFolderPath, `Family${entry.kutumb_no}-${entry.surname}.pdf`),
                    format: 'A4',
                    printBackground: true
                })

                await page.close()
            }))

            await browser.close();

            const familyData = data.family;

            const pdfPaths: string[] = [];

            for (const entry of familyData) {
                pdfPaths.push(path.join(VasriPatrakFolderPath, `Family${entry.kutumb_no}-${entry.surname}.pdf`));
            }

            await this.CreateVastiPatrakPDF(`VastiPatrak.pdf`, pdfPaths);

            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = {
                status: "200",
                message: "VastiPatrak Generated Successfully"
            }
            return apiResponse;
        }
        catch (error: any) {
            console.log(error)
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }


    /**
     * Get VastiPatrak Templates
     */
    public async GetTempates(): Promise<ApiResponseDto | undefined> {
        let apiResponse = new ApiResponseDto();

        try {

            let fileContentDictionary = await ReadFilesFromDirectory(process.cwd() + '/VastiPatrak/templates')

            apiResponse.status = 1;
            apiResponse.data = fileContentDictionary;
            return apiResponse;
        } catch (error: any) {
            apiResponse.status = 0;
            apiResponse.error = new ErrorDto();
            apiResponse.error.errorCode = "501";
            apiResponse.error.errorMsg = error;
            return apiResponse;
        }
    }

    private async CreateVastiPatrakPDF( outputFileName: string, pdfPaths: string[]) {
        const merger = new PDFMerger();

        await Promise.all(pdfPaths.map(async (pdfPath) => {
            await merger.add(pdfPath);
        }))

        await merger.setMetadata({
            producer: "pdf-merger-js based script",
            author: "Kutch Suthar Mevada Suthar Samaj-Sukhpar",
            creator: "Kutch Suthar Mevada Suthar Samaj-Sukhpar",
            title: `Kutch Suthar Mevada Suthar Samaj-Sukhpar Vastipatrak ${new Date().getFullYear()}`
        });

        const VasriPatrakFolderPath = path.join('VastiPatrak/pdfs', outputFileName)
        const mergedPdfBuffer = await merger.saveAsBuffer();
        fs.writeFileSync(VasriPatrakFolderPath, mergedPdfBuffer);
    }
}