export declare abstract class CreatedAtEntity {
    createdAt: Date;
}
export declare abstract class CreatedUpdatedEntity extends CreatedAtEntity {
    updatedAt: Date;
}
export declare abstract class SoftDeleteEntity extends CreatedUpdatedEntity {
    deletedAt: Date | null;
}
