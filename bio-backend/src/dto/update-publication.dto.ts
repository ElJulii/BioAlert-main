import { PartialType } from "@nestjs/mapped-types";
import { PublicationDTO } from "./publication.dto";

export class UpdateRegisterDto extends PartialType(PublicationDTO) {}