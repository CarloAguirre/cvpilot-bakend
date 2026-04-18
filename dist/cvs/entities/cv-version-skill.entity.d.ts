import { CvVersion } from './cv-version.entity';
import { Skill } from './skill.entity';
export declare class CvVersionSkill {
    id: string;
    cvVersionId: string;
    skillId: string;
    displayOrder: number;
    cvVersion: CvVersion;
    skill: Skill;
}
