import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class PaginationMetaDTO {
  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

class PaginationLinksDTO {
  @ApiProperty()
  first: string;

  @ApiProperty()
  last: string;

  @ApiPropertyOptional()
  next?: string;

  @ApiPropertyOptional()
  previous?: string;
}

export class PaginationAdapterDTO<T> {
  data: T[];

  @ApiProperty({ type: PaginationMetaDTO })
  meta: PaginationMetaDTO;

  @ApiProperty({ type: PaginationLinksDTO })
  links: PaginationLinksDTO;
}
