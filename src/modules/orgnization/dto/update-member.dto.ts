import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsStrongPassword,
    MaxLength,
    MinLength,
    NotEquals
} from "class-validator";
import {CleanEmail, CleanName} from "../../../common/decorators/transform.decorators.js";
import {OrganizationRole} from "../../orgnization-member/entity/organization-member.entity.js";

export class UpdateMemberDto {
    @CleanName()
    @IsOptional()
    @IsString({message: "First name must be a string"})
    @MaxLength(100, {message: "First name cannot exceed 100 characters"})
    firstName?: string;

    @CleanName()
    @IsOptional()
    @IsString({message: "Last name must be a string"})
    @MaxLength(100, {message: "Last name cannot exceed 100 characters"})
    lastName?: string;

    @CleanEmail()
    @IsOptional()
    @IsEmail({}, {message: "Please provide a valid email address"})
    @MaxLength(255, {message: "Email cannot exceed 255 characters"})
    email?: string;

    @IsOptional()
    @IsString({message: "Password must be a string"})
    @MinLength(8, {message: "Password must be at least 8 characters long"})
    @MaxLength(64, {message: "Password cannot exceed 64 characters"})
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        },
    )
    password?: string;

    @IsOptional()
    @IsEnum(OrganizationRole, {message: `Role must be one of ${Object.values(OrganizationRole).join(', ')} except ${OrganizationRole.ORG_OWNER}`})
    @NotEquals(OrganizationRole.ORG_OWNER, {message: "Role cannot be owner"})
    role?: Exclude<OrganizationRole, OrganizationRole.ORG_OWNER>;

    @IsOptional()
    @IsString({message: "Status must be a string"})
    status?: string;
}

export {UpdateMemberDto as UpdateMemberReq};
