import { PersonDto } from "../dtos/person-dto";
import { Person } from "../model/person";
import { BaseService } from "./base-service";

interface IPersonService  {
    /**
     * Create new record using given instance of Dto object for a entity type.
     * @param dtoRecord 
     */
    Create(dtoRecord: PersonDto): Promise<PersonDto | undefined>
}

export class PersonService extends BaseService implements IPersonService {
    /**
     * Create new record using given instance of Dto object for a entity type.
     * @param dtoRecord 
     * @returns 
     */
    public async Create(dtoRecord: PersonDto): Promise<PersonDto | undefined> {
        debugger
        try {

            const recordCreatedInfo = this.SetRecordCreatedInfo(dtoRecord);
            const recordModifiedInfo = this.SetRecordModifiedInfo(dtoRecord);

            console.log("Creating")
            const person = await Person.create({
                name: dtoRecord.name,
                surname: dtoRecord.surname,
                wifeSurname: dtoRecord.wifeSurname,
                city: dtoRecord.city,
                currResidency: dtoRecord.currResidency,
                marriedStatus: dtoRecord.marriedStatus,
                birthDate: dtoRecord.birthDate,
                weddingDate: dtoRecord.weddingDate,
                education: dtoRecord.education,
                occupation: dtoRecord.occupation,
                mobileNumber: dtoRecord.mobileNumber,
                createdAt: recordCreatedInfo.createdAt,
                createdById: recordCreatedInfo.createdById,
                updatedAt: recordModifiedInfo.updatedAt,
                updatedById: recordModifiedInfo.updatedById 
            })

            console.log(person)

            return person;
        } catch (error) {
            console.log(error)
        }
        return undefined;
    }

}

