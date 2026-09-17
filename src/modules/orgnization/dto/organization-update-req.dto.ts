import {IsOptional, IsString, Length, Matches, MaxLength} from "class-validator";

export class OrganizationUpdateReq {
    @IsOptional()
    @IsString()
    @MaxLength(150, {message: "Name cannot exceed 150 characters"})
    name?: string;

    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9-]+$/, {message: 'slug must be lowercase, alphanumeric, hyphens only'})
    slug?: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    @IsString()
    @Length(3, 3, {message: "Currency must be a 3-letter code"})
    currency?: string;
}