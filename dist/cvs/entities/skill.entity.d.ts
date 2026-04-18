import { CreatedAtEntity } from '../../common/entities/timestamped.entity';
import { CvVersionSkill } from './cv-version-skill.entity';
export declare class Skill extends CreatedAtEntity {
    id: string;
    name: string;
    normalizedName: string;
    category: string | null;
    versionSkills: CvVersionSkill[];
}
