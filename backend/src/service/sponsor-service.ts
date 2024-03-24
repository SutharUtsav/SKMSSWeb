import { Sequelize, Op } from "sequelize";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { SponsorDto } from "../dtos/sponsor-dto";
import { Sponsor, Sponsorship, sponsorAttributesList, sponsorAttributesLookupList, sponsorshipAttributesList, sponsorshipAttributesLookupList } from "../model/sponsor";
import { BaseService } from "./base-service";
import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";
import { EnumErrorMsg, EnumErrorMsgCode, EnumErrorMsgText } from "../consts/enumErrors";
import { RemoveFile } from "../helper/file-handling";


const sequelize = require('../config/db')
const path = require('path')

export interface ISponsorService {
    /**
     * Get All Records of Event Entity 
     */
    GetRecords(lookup?: boolean, id?: number, isActive?: boolean): Promise<ApiResponseDto | undefined>;

    /**
     * Create Record for Sponsor and sponsorshipd
     * @param dtoRecord 
     * @param id
     */
    Create(dtoRecord: SponsorDto, id?: bigint): Promise<ApiResponseDto | undefined>;

    /**
     * Update Record of Sponsor
     * @param dtoRecord 
     * @param id 
     */
    Update(dtoRecord: SponsorDto, id: number): Promise<SponsorDto | ApiResponseDto | undefined>;


    /**
     * Update Record for Sponsorship
     * @param dtoRecord 
     * @param id Sponso Id 
     */
    UpdateSponsorship(dtoRecord: SponsorDto, id: bigint): Promise<SponsorDto | ApiResponseDto | undefined>;

    /**
     * Update Attachments for Sponsorship
     * @param dtoRecord 
     * @param id Sponso Id
     */
    UpdateSponsorshipAttachment(dtoRecord: SponsorDto, id: bigint): Promise<SponsorDto | ApiResponseDto | undefined>;


    /**
     * Remove Sponsor and Sponsorship
     */
    Remove(id: bigint): Promise<SponsorDto | ApiResponseDto | undefined>;

}


export class SponsorService extends BaseService implements ISponsorService {
    /**
     * Get All Records of Event Entity 
     */
    public async GetRecords(lookup?: boolean, id?: number, isActive?: boolean): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {

            //prepare condition
            let where: any = {};

            if (id) {
                where.id = id
            }

            let activeSponsorshipComparision: any = {}

            if (isActive) {
                activeSponsorshipComparision = {
                    endDate: {
                        [Op.gt]: new Date()
                    }
                }
            }
            let sponsorData: any = await Sponsor.findAll({
                attributes: lookup ? sponsorAttributesLookupList : sponsorAttributesList,
                raw: true,
                where: where,
                include: [{
                    model: Sponsorship,
                    as: 'SponsorShip',
                    attributes: lookup ? sponsorshipAttributesLookupList : sponsorshipAttributesList,
                    required: isActive,    //false: LEFT OUTER JOIN 
                    on: {
                        id: Sequelize.literal('"Sponsor"."id"="SponsorShip"."sponsorId"'),
                    },
                    where: activeSponsorshipComparision
                }]
            })




            sponsorData = await Promise.all(sponsorData.map((sponsor: any) => {

                const sponsorShipData = {
                    sponsorId: sponsor['SponsorShip.sponsorId'],
                    purpose: sponsor['SponsorShip.purpose'],
                    amount: sponsor['SponsorShip.amount'],
                    startDate: sponsor['SponsorShip.startDate'],
                    endDate: sponsor['SponsorShip.endDate'],
                    paymentStatus: sponsor['SponsorShip.paymentStatus'],
                    adsAttachments: String(sponsor['SponsorShip.adsAttachments']).split(',').map((attachment: string) => {
                        return attachment ? `http://${process.env["LOCAL_URL"]}${process.env["LOCAL_SUBURL"]}/sponsor/attachment/${attachment}` : null
                    }),
                };


                sponsor.Sponsorship = [sponsorShipData];

                for (const key in sponsor) {
                    if (key.startsWith('SponsorShip.')) {
                        delete sponsor[key];
                    }
                }


                return sponsor;
            }))

            if (sponsorData && sponsorData.length > 0) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 1;
                apiResponse.data = sponsorData;
                return apiResponse;
            }
            else {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = '200';
                errorDto.errorMsg = EnumApiResponseMsg[EnumApiResponse.NO_DATA_FOUND]
                apiResponse.error = errorDto;
            }

            return apiResponse;
        }
        catch (error: any) {
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
     * Create Record for Sponsor and sponsorshipd
     * @param dtoRecord 
     * @param id
     */
    public async Create(dtoRecord: SponsorDto, id?: bigint): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        const transaction = await sequelize.transaction();
        try {

            console.log("Inside sponsor service create method: " + dtoRecord)
            console.log("id " + id)

            let sponsorData = null;

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);


            if (id) {
                sponsorData = await Sponsor.findOne({
                    attributes: sponsorAttributesLookupList,
                    where: {
                        id: id
                    },
                    raw: true
                })
            }
            else {

                const sponsorDto: SponsorDto = SponsorDto.convertToSponsorData(dtoRecord);
                sponsorData = await Sponsor.create({
                    ...sponsorDto,
                    createdAt: recordCreatedInfo.createdAt,
                    createdById: recordCreatedInfo.createdById,
                    updatedAt: recordModifiedInfo.updatedAt,
                    updatedById: recordModifiedInfo.updatedById,
                    disabled: false,
                    enabledDisabledOn: new Date(),
                }, {
                    row: true,
                    transaction
                })
            }

            console.log("Sponsor Create : " + SponsorDto.printToConsole(sponsorData));


            if (!sponsorData) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                apiResponse.error = errorDto;
                return apiResponse;
            }


            const sponsorshipDto: SponsorDto = SponsorDto.convertToSponsorshipData(dtoRecord);
            sponsorshipDto.sponsorId = sponsorData.id;
            let sponsorshipData = await Sponsorship.create({
                ...sponsorshipDto,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById,
                disabled: false,
                enabledDisabledOn: new Date(),
            }, {
                row: true,
                transaction
            })

            console.log("Sponsorship Create" + SponsorDto.printToConsole(sponsorshipData));

            if (!sponsorshipData) {
                apiResponse = new ApiResponseDto();
                apiResponse.status = 0;
                let errorDto = new ErrorDto();
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_SOMETHING_WENT_WRONG].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_SOMETHING_WENT_WRONG];
                apiResponse.error = errorDto;
                return apiResponse;
            }

            apiResponse = new ApiResponseDto();
            apiResponse.status = 1;
            apiResponse.data = {
                sponsor: sponsorData,
                sponsorship: sponsorshipData
            }

            transaction.commit();
            return apiResponse;
        }
        catch (error: any) {
            transaction.rollback();
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
     * Update Record of Sponsor
     * @param dtoRecord 
     * @param id 
     */
    public async Update(dtoRecord: SponsorDto, id: number): Promise<SponsorDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        // const transaction = await sequelize.transaction();
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {

            let sponsorData = await Sponsor.findOne({
                where: {
                    id: id
                },
                raw: true,
                attributes: ['id']
            })

            console.log("Find Sponsor : " + sponsorData);

            if (!sponsorData) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }


            sponsorData = await Sponsor.update({
                ...dtoRecord,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById
            }, {
                where: {
                    id: id
                }
            })

            if (!sponsorData) {
                return undefined;
            }

            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = { status: 1, message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
            return apiResponse;


        }
        catch (error: any) {
            // transaction.rollback();
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
     * Update Record for Sponsorship
     * @param dtoRecord 
     */
    public async UpdateSponsorship(dtoRecord: SponsorDto, id: bigint): Promise<SponsorDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        // const transaction = await sequelize.transaction();
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {
            let sponsorshipData = await Sponsorship.findOne({
                where: {
                    sponsorId: id
                },
                raw: true,
                attributes: ['id']
            })

            console.log("Find Sponsorship data : " + sponsorshipData);

            if (!sponsorshipData) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }

            sponsorshipData = await Sponsorship.update({
                ...dtoRecord,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById
            }, {
                where: {
                    sponsorId: id
                }
            })

            if (!sponsorshipData) {
                return undefined;
            }

            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = { status: 1, message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
            return apiResponse;
        }
        catch (error: any) {
            // transaction.rollback();
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
     * Update Attachments for Sponsorship
     * @param dtoRecord 
     * @param id Sponso Id
     */
    public async UpdateSponsorshipAttachment(dtoRecord: SponsorDto, id: bigint): Promise<SponsorDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        // const transaction = await sequelize.transaction();
        const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

        try {

            // let sponsorData = await Sponsor.findOne({
            //     where: {
            //         id: id
            //     },
            //     raw: true,
            //     attributes: ['id'],
            //     includes: [{
            //         model: Sponsorship,
            //         as: "Sponsorship",
            //         required : true,
            //         attributes: ['id', 'attachment'],
            //         on: {
            //             id: Sequelize.literal('"Sponsor"."id"="Sponsorship"."sponsorId"'),
            //         },
            //         where: {
            //             endDate :{
            //                 [Op.gte] : new Date()
            //             }
            //         }
            //     }]
            // })

            let sponsorshipData: SponsorDto = await Sponsorship.findOne({
                where: {
                    sponsorId: id
                },
                raw: true,
                attributes: ['adsAttachments']
            })

            console.log("Find Sponsorship data with attachments: " + sponsorshipData);

            if (!sponsorshipData) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }


            let attachments: string[] | undefined = sponsorshipData.adsAttachments?.split(',');

            console.log("attachments : " + attachments);
            if (!attachments) {
                return undefined;
            }

            //Remove old attachments
            const dPath = 'Images/Sponsor-Webp';
            Promise.all(attachments.map(async (attachment: string) => {
                const filepath = path.join(dPath, attachment);
                await RemoveFile(filepath)
            }))


            sponsorshipData = await Sponsorship.update({
                ...dtoRecord,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById
            }, {
                where: {
                    sponsorId: id
                }
            })

            if (!sponsorshipData) {
                return undefined;
            }

            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = { status: 1, message: EnumApiResponseMsg[EnumApiResponse.UPDATED_SUCCESS] };
            return apiResponse;

        }
        catch (error: any) {
            // transaction.rollback();
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
     * Remove Sponsor and Sponsorship
     */
    public async Remove(id: bigint): Promise<SponsorDto | ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        const transaction = await sequelize.transaction();

        try {

            let sponsorData = await Sponsor.findOne({
                where: {
                    id: id
                },
                attributes: ['id']
            })

            if (!sponsorData) {
                apiResponse = new ApiResponseDto();
                let errorDto = new ErrorDto();
                apiResponse.status = 0;
                errorDto.errorCode = EnumErrorMsgCode[EnumErrorMsg.API_RECORD_NOT_FOUND].toString();
                errorDto.errorMsg = EnumErrorMsgText[EnumErrorMsg.API_RECORD_NOT_FOUND]
                apiResponse.error = errorDto;
                return apiResponse;
            }

            sponsorData = await Sponsor.destroy({
                where: {
                    id: id
                },
                transaction
            })

            if (!sponsorData) {
                return undefined;
            }

            let sponsorshipData = await Sponsorship.findOne({
                where: {
                    sponsorId: id,
                },
                attributes: ['adsAttachments']
            })

            if(sponsorshipData){
                let attachments : string[] | undefined = String(sponsorshipData.adsAttachments).split(',');

                if (!attachments) {
                    return undefined;
                }
    
                //Remove old attachments
                const dPath = 'Images/Sponsor-Webp';
                Promise.all(attachments.map(async (attachment: string) => {
                    const filepath = path.join(dPath, attachment);
                    await RemoveFile(filepath)
                }))

                sponsorshipData = await Sponsorship.destroy({
                    where:{
                        sponsorId: id
                    },
                    transaction
                })

                if(!sponsorData){
                    return undefined
                }
            }

            transaction.commit();
            apiResponse = new ApiResponseDto()
            apiResponse.status = 1;
            apiResponse.data = { status: 1, message: EnumApiResponseMsg[EnumApiResponse.REMOVE_SUCCESS] };
            return apiResponse;
        }
        catch (error: any) {
            transaction.rollback();
            apiResponse = new ApiResponseDto();
            let errorDto = new ErrorDto();
            errorDto.errorCode = '400';
            errorDto.errorMsg = error.toString();
            apiResponse.status = 0;
            apiResponse.error = errorDto;
            return apiResponse;
        }
    }
}