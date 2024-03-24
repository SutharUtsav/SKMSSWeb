import { BaseDtoWithCommonFields } from "./base-dto";

export class FundsDto extends BaseDtoWithCommonFields{

    donorId!:bigint | null;
    purpose!:string | null;
    amount!:number | null;
    donationDate!: string | null;
    

    /**
     * return fields of sponsor model
     * @param data 
     * @returns 
     */
    static convertToSponsorData = (data: FundsDto): FundsDto => {
        let fundsDto:FundsDto = new FundsDto();
        
        fundsDto.donationDate= data.donationDate;
        fundsDto.donorId= data.donorId;
        fundsDto.purpose= data.purpose;
        fundsDto.amount= data.amount;
        
        return fundsDto
        
    }

    static printToConsole = (data: FundsDto):void =>{
        console.log("Donor Id : " + data.donorId);
        console.log("Purpose : " + data.purpose);
        console.log("Amount : " + data.amount);
        console.log("Donation Date : " + data.donationDate);
    }
}


export class DonorDto extends BaseDtoWithCommonFields{
    name!:string | null;
    email!:string | null;
    phone!:string | null;
    address!:string | null;
    communityMemberId!:bigint | null;


    /**
     * return object of DonorDto
     * @param data 
     * @returns 
     */
    static convertToSponsorData = (data: DonorDto): DonorDto => {
        let donorDto:DonorDto = new DonorDto();
        
        donorDto.name= data.name;
        donorDto.email= data.email;
        donorDto.phone= data.phone;
        donorDto.address= data.address;
        donorDto.communityMemberId = data.communityMemberId;
        return donorDto
        
    }

    static printToConsole = (data: DonorDto):void =>{
        console.log("Name : " + data.name);
        console.log("Email : " + data.email);
        console.log("Phone : " + data.phone);
        console.log("Address : " + data.address);
        console.log("Community Member Id :"  + data.communityMemberId);
        

    }
}
