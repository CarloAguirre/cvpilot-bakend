import { CvImprovementRequestStatus } from '../../common/enums/database.enums';
export declare class UpdateCvImprovementRequestDto {
    status?: CvImprovementRequestStatus;
    errorMessage?: string;
    resultCvVersionId?: string;
}
