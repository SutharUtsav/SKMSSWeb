import { ApiResponseDto, ErrorDto } from "../dtos/api-response-dto";

const sequelize = require('../config/db');

export const createTable = async (tableName: string, originalTableName: string): Promise<ApiResponseDto | undefined> => {
    let apiResponse: ApiResponseDto = new ApiResponseDto();
    try {
        const dropTableQuery = `DROP TABLE IF EXISTS "${tableName}";`;
        const createTableQuery = `CREATE TABLE "${tableName}" AS SELECT * FROM "${originalTableName}" WHERE 1=0; -- This condition ensures no data is copied, only the structure`;

        let resp = await sequelize.query(dropTableQuery);

        console.log("DROP", resp);

        resp = await sequelize.query(createTableQuery);
        console.log(resp)

        apiResponse.status = 1;
        apiResponse.data = {
            status: "200",
            message: "CREATED TABLE"
        }
        return apiResponse;

    } catch (err: any) {
        apiResponse.status = 0;
        let errorDto: ErrorDto = new ErrorDto();
        errorDto.errorCode = '400';
        errorDto.errorMsg = err.toString();
        apiResponse.error = errorDto;
        return apiResponse;
    }

    // let response = await sequelize
}