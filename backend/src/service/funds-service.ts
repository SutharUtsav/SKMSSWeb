import { Sequelize } from "sequelize";
import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";
import { Donor, Funds, donorAttributesList, donorAttributesLookupList, fundsAttributesList, fundsAttributesLookupList } from "../model/fund-donor";
import { BaseService } from "./base-service";
import { EnumApiResponse, EnumApiResponseMsg } from "../consts/enumApiResponse";

export interface IFundsService {
    /**
     * Get All Records of Donor and Funds Entity 
     */
    GetRecords(findFunds?: boolean, lookup?: boolean, id?: number): Promise<ApiResponseDto | undefined>;
}


export class FundsService extends BaseService implements IFundsService {
    /**
     * Get All Records of Donor and Funds Entity 
     */
    public async GetRecords(findFunds?: boolean, lookup?: boolean, id?: number): Promise<ApiResponseDto | undefined> {
        let apiResponse!: ApiResponseDto;
        try {
            if (!findFunds) {
                //Find Records of Donors
                //prepare condition
                let where: any = {};

                if (id) {
                    where.id = id
                }

                let donorData: any = await Donor.findAll({
                    attributes: lookup ? donorAttributesLookupList : donorAttributesList,
                    raw: true,
                    where: where,
                    include: [{
                        model: Funds,
                        as: 'Funds',
                        attributes: lookup ? fundsAttributesLookupList : fundsAttributesList,
                        required: false,    //false: LEFT OUTER JOIN 
                        on: {
                            id: Sequelize.literal('"Donor"."id"="Funds"."donorId"'),
                        }
                    }]
                })


                donorData = await Promise.all(donorData.map((donor: any) => {

                    const fundsData = {
                        donorId: donor['Funds.donorId'],
                        purpose: donor['Funds.purpose'],
                        amount: donor['Funds.amount'],
                        donationDate: donor['Funds.donationDate'],
                    };


                    donor.Sponsorship = [fundsData];

                    for (const key in donor) {
                        if (key.startsWith('Funds.')) {
                            delete donor[key];
                        }
                    }


                    return donor;
                }))

                if (donorData && donorData.length > 0) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = donorData;
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
            else {
                let fundsData: any = await Funds.findAll({
                    attributes: lookup ? fundsAttributesLookupList : fundsAttributesList,
                    raw: true,
                    include: [{
                        model: Donor,
                        as: 'Donor',
                        attributes: lookup ? fundsAttributesLookupList : fundsAttributesList,
                        required: true,    //false: LEFT OUTER JOIN 
                        on: {
                            id: Sequelize.literal('"Donor"."id"="Funds"."donorId"'),
                        }
                    }]
                })

                fundsData = await Promise.all(fundsData.map((funds: any) => {

                    const donorData = {
                        name: funds['Donor.name'],
                        email: funds['Donor.email'],
                        address: funds['Donor.address'],
                        phone: funds['Donor.phone'],
                        communityMemberId: funds['Donor.communityMemberId']
                    };


                    funds.Donor = donorData;

                    for (const key in funds) {
                        if (key.startsWith('Donor.')) {
                            delete funds[key];
                        }
                    }


                    return funds;
                }))

                if (fundsData && fundsData.length > 0) {
                    apiResponse = new ApiResponseDto();
                    apiResponse.status = 1;
                    apiResponse.data = fundsData;
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


}