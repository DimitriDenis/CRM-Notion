import { Transform } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

// src/modules/deals/dto/get-recent-deals.dto.ts
export class GetRecentDealsDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 5;
  }