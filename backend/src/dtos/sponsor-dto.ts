import { BaseDtoWithCommonFields } from "./base-dto";

export const sponsorshipActivationList = ["Active", "Expire"];

export class SponsorDto extends BaseDtoWithCommonFields{
    name!:string | null;
    email!:string | null;
    phone!:string | null;
    address!:string | null;

    sponsorId!:bigint | null;
    purpose!:string | null;
    amount!:number | null;
    adsAttachments!: string | null;
    startDate!: string | null;
    endDate!: string | null;
    paymentStatus!: string | null;


    /**
     * return fields of sponsor model
     * @param data 
     * @returns 
     */
    static convertToSponsorData = (data: SponsorDto): SponsorDto => {
        let sponsorDto:SponsorDto = new SponsorDto();
        
        sponsorDto.name= data.name;
        sponsorDto.email= data.email;
        sponsorDto.phone= data.phone;
        sponsorDto.address= data.address;
        return sponsorDto
        
    }

    /**
     * return fields of sponsorhship model
     * @param data 
     * @returns 
     */
    static convertToSponsorshipData = (data: SponsorDto): SponsorDto => {
        let sponsorDto:SponsorDto = new SponsorDto();
        
        sponsorDto.sponsorId= data.sponsorId;
        sponsorDto.purpose= data.purpose;
        sponsorDto.amount= data.amount;
        sponsorDto.adsAttachments= data.adsAttachments;
        sponsorDto.startDate= data.startDate;
        sponsorDto.endDate= data.endDate;
        sponsorDto.paymentStatus= data.paymentStatus;

        return sponsorDto
        
    }


    static printToConsole = (data: SponsorDto):void =>{
        console.log("Name : " + data.name);
        console.log("Email : " + data.email);
        console.log("Phone : " + data.phone);
        console.log("Address : " + data.address);
        console.log("Purpose : " + data.purpose);
        console.log("Amount : " + data.amount);
        console.log("AdsAttachment : " + data.adsAttachments);
        console.log("Start Date : " + data.startDate);
        console.log("End Date : " + data.endDate);
        console.log("Payment Status : " + data.paymentStatus);

    }
    // imageURLs!:string[] | null;
}
